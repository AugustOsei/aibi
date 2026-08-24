import assert from "node:assert/strict";
import test from "node:test";

import { getCountryEvidence, getCountrySummaries, getIndustrySummaries, getLawFirmIndustryView } from "../src/application/aibi-service.js";
import { calculateLawFirmBaseline } from "../src/possible/law-firm-baseline.js";
import { COUNTRY_PRACTICAL_CONTEXTS, INDUSTRY_OUTLOOKS } from "../src/data/industry-outlooks.js";

test("Law Firm view model gets Possible directly from the baseline engine", () => {
  const view = getLawFirmIndustryView();
  const baseline = calculateLawFirmBaseline();
  assert.equal(view.possible.value, baseline.overallPracticality);
  assert.deepEqual(
    view.functions.map(({ id, practicality }) => ({ id, practicality })),
    baseline.functions.map(({ businessFunctionId: id, practicality }) => ({ id, practicality })),
  );
});

test("partial Actual and missing Gap remain explicit null states, never zero", () => {
  const view = getLawFirmIndustryView();
  assert.equal(view.actual.status, "partial");
  assert.equal(view.actual.value, null);
  assert.equal(view.actual.observations.length, 4);
  assert.equal(view.gap.status, "insufficient_evidence");
  assert.equal(view.gap.value, null);
  assert.notEqual(view.actual.value, 0);
  assert.notEqual(view.gap.value, 0);
});

test("law-firm adoption observations remain separate, sourced constructs", () => {
  const observations = getLawFirmIndustryView().actual.observations;
  assert.deepEqual(observations.map(({ value }) => value), [68, 33, 79, 40]);
  assert.deepEqual(observations.map(({ scopeLabel }) => scopeLabel), [
    "Direct law-firm evidence",
    "Direct law-firm evidence",
    "Broader legal-profession evidence",
    "Broader legal-profession evidence",
  ]);
  assert.equal(new Set(observations.map(({ label }) => label)).size, observations.length);
  assert.ok(observations.every(({ source, denominator }) => source.url && denominator.length > 0));
});

test("catalog exposes only the seeded countries and industries with honest statuses", () => {
  const industries = getIndustrySummaries();
  const countries = getCountrySummaries();
  assert.equal(industries.length, 8);
  assert.equal(countries.length, 4);
  assert.equal(industries.filter(({ status }) => status === "available").length, 1);
  assert.equal(industries.filter(({ status }) => status === "partial").length, 7);
  assert.equal(countries.filter(({ status }) => status === "partial").length, 3);
  assert.equal(countries.filter(({ status }) => status === "insufficient_evidence").length, 1);
});

test("every unscored industry has a complete three-level capability outlook", () => {
  assert.equal(INDUSTRY_OUTLOOKS.length, 7);
  assert.ok(INDUSTRY_OUTLOOKS.every(({ tiers, sources }) => tiers.length === 3 && sources.length >= 2));
  assert.ok(INDUSTRY_OUTLOOKS.every(({ tiers }) => tiers.every(({ useCases }) => useCases.length === 4)));
  assert.equal(COUNTRY_PRACTICAL_CONTEXTS.length, 4);
  assert.ok(COUNTRY_PRACTICAL_CONTEXTS.every(({ factors, sources }) => factors.length === 3 && sources.length > 0));
});

test("country evidence preserves official sector values and transparent mappings", () => {
  const us = getCountryEvidence("united-states");
  const uk = getCountryEvidence("united-kingdom");
  const canada = getCountryEvidence("canada");
  const ghana = getCountryEvidence("ghana");
  assert.ok(us && uk && canada && ghana);
  assert.deepEqual(us.observations.map(({ value }) => value), [39.3, 14.9, 8.3, 15.5, 11.3, 23.5]);
  assert.deepEqual(uk.observations.map(({ value }) => value), [42.1, 14.7, 8.1, 18.3, 11.6, 34.4]);
  assert.deepEqual(canada.observations.map(({ value }) => value), [31.7, 3.6, 1.5, 6.6, 7.3, 17.4]);
  assert.equal(ghana.observations.length, 0);
  assert.ok(us.observations.every(({ mappedIndustries, mappingNote }) => mappedIndustries.length > 0 && mappingNote.length > 0));
});

test("every scored task exposes readable capability evidence", () => {
  const view = getLawFirmIndustryView();
  const scored = view.functions.flatMap(({ tasks }) => tasks).filter(({ practicality }) => practicality > 0);
  assert.ok(scored.every(({ capabilities }) => capabilities.length > 0));
  assert.ok(scored.every(({ capabilities }) => capabilities.every(({ sources }) => sources.length > 0)));
});

test("public task constraints do not expose internal model field names", () => {
  const renderedView = JSON.stringify(getLawFirmIndustryView().functions);
  for (const internalName of ["integrationEase", "oversightSuitability", "riskSuitability", "technicalApplicability"]) {
    assert.equal(renderedView.includes(internalName), false);
  }
});

test("law-firm AI depth levels do not repeat the same task", () => {
  const view = getLawFirmIndustryView();
  const taskIds = view.workflowGroups.flatMap((group) => group.tasks.map((task) => task.id));
  assert.equal(new Set(taskIds).size, taskIds.length);
  assert.equal(taskIds.length, view.functions.flatMap((businessFunction) => businessFunction.tasks).length);
});
