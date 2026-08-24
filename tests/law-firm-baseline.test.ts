import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { calculatePossibleBaseline } from "../src/possible/calculate-baseline.js";
import {
  LAW_FIRM_BASELINE_DEFINITION,
  calculateLawFirmBaseline,
} from "../src/possible/law-firm-baseline.js";

const findTask = (report: ReturnType<typeof calculateLawFirmBaseline>, taskId: string) => {
  const task = report.functions.flatMap((item) => item.tasks).find((item) => item.taskId === taskId);
  assert.ok(task, `Expected task ${taskId}`);
  return task;
};

test("changing a capability version changes affected task and function scores", () => {
  const original = calculateLawFirmBaseline();
  const changed = structuredClone(LAW_FIRM_BASELINE_DEFINITION);
  const classification = changed.capabilityVersions.find((item) => item.id === "capability-classification-v2026-08");
  assert.ok(classification);
  classification.maturity.normalizedValue = 0.1;
  classification.version = "test-lower-maturity";

  const recalculated = calculatePossibleBaseline(changed);
  assert.notEqual(
    findTask(recalculated, "task-classify-work-product").practicality,
    findTask(original, "task-classify-work-product").practicality,
  );
  assert.notEqual(
    recalculated.functions.find((item) => item.businessFunctionId === "function-knowledge-management")?.practicality,
    original.functions.find((item) => item.businessFunctionId === "function-knowledge-management")?.practicality,
  );
});

test("high task risk limits practical use despite strong technical capability", () => {
  const highRisk = calculateLawFirmBaseline();
  const lowerRiskDefinition = structuredClone(LAW_FIRM_BASELINE_DEFINITION);
  const task = lowerRiskDefinition.tasks.find((item) => item.id === "task-draft-routine-documents");
  assert.ok(task);
  task.risk = "low";
  task.oversight = "minimal";
  task.recommendedRole = "mostly_automate";

  const lowerRisk = calculatePossibleBaseline(lowerRiskDefinition);
  assert.ok(
    findTask(highRisk, task.id).practicality < findTask(lowerRisk, task.id).practicality,
    "Expected the original risk/oversight caps to reduce the score",
  );
});

test("tasks with no applicable capability receive zero, not invented practicality", () => {
  const report = calculateLawFirmBaseline();
  const finalAdvice = findTask(report, "task-deliver-final-advice");
  const advocacy = findTask(report, "task-conduct-advocacy");
  assert.equal(finalAdvice.practicality, 0);
  assert.equal(advocacy.practicality, 0);
  assert.equal(finalAdvice.majorLimitingFactor, "No applicable AI capability");
});

test("overall law-firm baseline is reproducible from function and task scores", () => {
  const first = calculateLawFirmBaseline();
  const second = calculateLawFirmBaseline();
  assert.deepEqual(second, first);

  const reconstructedOverall = Math.round(
    first.functions.reduce((sum, item) => sum + item.practicality * item.weight, 0) * 10,
  ) / 10;
  assert.equal(first.overallPracticality, reconstructedOverall);

  for (const businessFunction of first.functions) {
    const definitions = LAW_FIRM_BASELINE_DEFINITION.tasks.filter(
      (task) => task.businessFunctionId === businessFunction.businessFunctionId,
    );
    const reconstructed = Math.round(
      businessFunction.tasks.reduce((sum, task) => {
        const definition = definitions.find((item) => item.id === task.taskId);
        assert.ok(definition);
        return sum + task.practicality * definition.weightWithinFunction;
      }, 0) * 10,
    ) / 10;
    assert.equal(businessFunction.practicality, reconstructed);
  }
});

test("Possible calculation has traceable evidence and no Actual/adoption inputs", async () => {
  const report = calculateLawFirmBaseline();
  const allowedInputTypes = new Set([
    "possible_score_configuration", "business_function", "business_task",
    "ai_capability_version", "capability_evidence", "task_capability_mapping",
  ]);
  assert.ok(report.inputs.every((input) => allowedInputTypes.has(input.entityType)));
  assert.ok(report.functions.flatMap((item) => item.tasks).filter((task) => task.practicality > 0)
    .every((task) => task.capabilityContributions.every((contribution) => contribution.evidenceIds.length > 0)));

  const possibleModules = await Promise.all([
    readFile(new URL("../src/possible/calculate-baseline.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/possible/law-firm-baseline.ts", import.meta.url), "utf8"),
  ]);
  assert.ok(possibleModules.every((source) => !source.includes("types/actual")));
  assert.ok(possibleModules.every((source) => !source.includes("adoptionObservation")));

  const contaminatedDefinition = {
    ...LAW_FIRM_BASELINE_DEFINITION,
    actualData: [{ value: 50 }],
  };
  assert.throws(
    () => calculatePossibleBaseline(contaminatedDefinition),
    /unsupported inputs: actualData/,
  );
});
