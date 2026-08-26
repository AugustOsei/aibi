import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateComparisonGap,
  type ActualComparisonCell,
  type PossibleComparisonCell,
} from "../src/comparison/calculate-gap.js";
import { COUNTRY_SECTOR_ADOPTION_OBSERVATIONS } from "../src/data/country-adoption.js";
import { LAW_FIRM_ADOPTION_OBSERVATIONS } from "../src/data/law-firm-adoption.js";

const possible = (taskId: string, value: number, weight = 1): PossibleComparisonCell => ({
  businessFunctionId: "function-operations",
  taskId,
  utilizationDepth: "standard",
  geographyKey: "country-test",
  value: { kind: "point", value },
  normalizedScaleId: "task-utilization-percent-v1",
  weight,
});

const actual = (
  observationId: string,
  taskId: string | null,
  value: number | null,
  evidenceRelation: "direct" | "proxy" = "direct",
  measure: ActualComparisonCell["mapping"]["measure"] = "task_utilization_rate",
): ActualComparisonCell => ({
  observationId,
  value: value === null ? { kind: "missing", reason: "not_published" } : { kind: "point", value },
  evidenceGrade: "B",
  mapping: {
    businessFunctionId: taskId ? "function-operations" : null,
    taskId,
    utilizationDepth: taskId ? "standard" : null,
    evidenceRelation,
    geography: { level: "country", geographyId: "country-test", label: "Test country" },
    evidenceConfidence: { level: "high", rationale: "Synthetic test evidence." },
    estimateBasis: "observed",
    measure,
    normalizedScaleId: measure === "broad_adoption_prevalence" ? null : "task-utilization-percent-v1",
    mappingRationale: "Synthetic test mapping.",
  },
});

test("incompatible broad-sector percentages cannot create a numeric gap", () => {
  const result = calculateComparisonGap(
    [possible("task-a", 80)],
    [actual("broad-sector-rate", null, 35, "proxy", "broad_adoption_prevalence")],
  );
  assert.equal(result.status, "insufficient");
  if (result.status === "insufficient") assert.equal(result.reasonCode, "unaligned_evidence");
});

test("missing Actual evidence is never treated as zero", () => {
  const result = calculateComparisonGap([possible("task-a", 80)], [actual("missing-task-rate", "task-a", null)]);
  assert.equal(result.status, "insufficient");
  if (result.status === "insufficient") assert.equal(result.reasonCode, "missing_actual");
  assert.equal("value" in result, false);
});

test("compatible task-aligned adoption evidence can produce a numeric gap", () => {
  const result = calculateComparisonGap(
    [possible("task-a", 80, 0.5), possible("task-b", 60, 0.5)],
    [actual("actual-a", "task-a", 30), actual("actual-b", "task-b", 20)],
  );
  assert.equal(result.status, "numeric");
  if (result.status === "numeric") {
    assert.equal(result.value, 45);
    assert.equal(result.coverage, 1);
    assert.equal(result.unit, "percentage_points");
  }
});

test("proxy evidence reduces confidence and cannot satisfy numeric direct coverage", () => {
  const result = calculateComparisonGap(
    [possible("task-a", 80, 0.5), possible("task-b", 80, 0.5)],
    [actual("actual-a", "task-a", 20), actual("proxy-b", "task-b", 20, "proxy")],
  );
  assert.equal(result.status, "directional");
  assert.equal(result.confidence.level, "medium");
  assert.equal(result.directCoverage, 0.5);
  assert.equal(result.proxyCoverage, 0.5);
});

test("directional High, Moderate, and Low thresholds are deterministic", () => {
  const directionFor = (actualValue: number) => calculateComparisonGap(
    [possible("task-a", 80)],
    [actual("proxy-a", "task-a", actualValue, "proxy")],
  );
  const high = directionFor(40);
  const moderate = directionFor(60);
  const low = directionFor(60.1);
  assert.equal(high.status === "directional" ? high.direction : null, "high");
  assert.equal(moderate.status === "directional" ? moderate.direction : null, "moderate");
  assert.equal(low.status === "directional" ? low.direction : null, "low");
});

test("identical comparison inputs reproduce identical results", () => {
  const possibleInputs = [possible("task-b", 65, 0.4), possible("task-a", 75, 0.6)];
  const actualInputs = [actual("actual-b", "task-b", 25), actual("actual-a", "task-a", 35)];
  assert.deepEqual(
    calculateComparisonGap(structuredClone(possibleInputs), structuredClone(actualInputs)),
    calculateComparisonGap(structuredClone(possibleInputs), structuredClone(actualInputs)),
  );
});

test("all current broad and law-firm observations remain explicitly unaligned to tasks", () => {
  const observations = [...COUNTRY_SECTOR_ADOPTION_OBSERVATIONS, ...LAW_FIRM_ADOPTION_OBSERVATIONS];
  assert.ok(observations.every(({ comparison }) => comparison.taskId === null));
  assert.ok(observations.every(({ comparison }) => comparison.businessFunctionId === null));
  assert.ok(observations.every(({ comparison }) => comparison.utilizationDepth === null));
  assert.ok(observations.every(({ comparison }) => comparison.normalizedScaleId === null));
  assert.ok(observations.every(({ comparison }) => comparison.evidenceRelation === "proxy"));
  assert.ok(LAW_FIRM_ADOPTION_OBSERVATIONS.every(({ comparison, confidence, provenance }) => (
    comparison.evidenceConfidence === confidence
    && comparison.estimateBasis === (provenance.kind === "modeled" ? "modeled" : "observed")
  )));
});
