import assert from "node:assert/strict";
import test from "node:test";

import { getCountryEvidence, getCountrySummaries, getIndustryAdoptionHeadroom, getIndustryGapAssessment, getIndustrySummaries, getLawFirmIndustryView } from "../src/application/aibi-service.js";
import { calculateLawFirmBaseline } from "../src/possible/law-firm-baseline.js";
import { COUNTRY_PRACTICAL_CONTEXTS, INDUSTRY_OUTLOOKS, getCountryPracticalContext } from "../src/data/industry-outlooks.js";
import { AI_CAPABILITY_HORIZON, COMMON_BUSINESS_FUNCTIONS } from "../src/data/ai-capability-horizon.js";

test("Law Firm view model gets Possible directly from the baseline engine", () => {
  const view = getLawFirmIndustryView();
  const baseline = calculateLawFirmBaseline();
  assert.equal(view.possible.value, baseline.overallPracticality);
  assert.deepEqual(
    view.functions.map(({ id, practicality }) => ({ id, practicality })),
    baseline.functions.map(({ businessFunctionId: id, practicality }) => ({ id, practicality })),
  );
});

test("partial Actual and insufficient Gap remain explicit null states, never zero", () => {
  const view = getLawFirmIndustryView();
  assert.equal(view.actual.status, "partial");
  assert.equal(view.actual.value, null);
  assert.equal(view.actual.observations.length, 4);
  assert.equal(view.gap.status, "insufficient");
  assert.equal(view.gap.value, null);
  assert.notEqual(view.actual.value, 0);
  assert.notEqual(view.gap.value, 0);
});

test("every current industry explains why its Gap is insufficient", () => {
  for (const industry of getIndustrySummaries()) {
    const gap = getIndustryGapAssessment(industry.slug, "united-states");
    assert.equal(gap.status, "insufficient");
    assert.ok(gap.explanation.length > 80);
  }
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

test("every industry has a complete three-level current-capability outlook", () => {
  assert.equal(INDUSTRY_OUTLOOKS.length, 8);
  assert.ok(INDUSTRY_OUTLOOKS.every(({ tiers, sources }) => tiers.length === 3 && sources.length >= 2));
  assert.ok(INDUSTRY_OUTLOOKS.every(({ tiers }) => tiers.every(({ useCases }) => useCases.length === 4)));
  assert.ok(INDUSTRY_OUTLOOKS.every(({ tiers }) => tiers.map(({ id }) => id).join(",") === "standard,integrated,advanced"));
  assert.equal(COUNTRY_PRACTICAL_CONTEXTS.length, 4);
  assert.ok(COUNTRY_PRACTICAL_CONTEXTS.every(({ factors, sources }) => factors.length === 3 && sources.length > 0));
  assert.ok(COUNTRY_PRACTICAL_CONTEXTS.every(({ tierGuidance }) => Object.keys(tierGuidance).join(",") === "standard,integrated,advanced"));
  assert.ok(COUNTRY_PRACTICAL_CONTEXTS.every(({ industryNotes }) => getIndustrySummaries().every(({ slug }) => Boolean(industryNotes[slug]))));
  assert.ok(getCountryPracticalContext("united-states"));
});

test("the dated capability horizon covers current multimodal and agentic AI", () => {
  assert.equal(AI_CAPABILITY_HORIZON.version, "2026.08");
  assert.equal(AI_CAPABILITY_HORIZON.effectiveDate, "2026-08-27");
  assert.equal(AI_CAPABILITY_HORIZON.lastReviewed, "2026-08-27");
  assert.equal(AI_CAPABILITY_HORIZON.capabilities.length, 8);
  assert.equal(new Set(AI_CAPABILITY_HORIZON.capabilities.map(({ id }) => id)).size, 8);
  assert.ok(["voice", "vision-images", "video-audio", "computer-use", "agents", "physical-ai"].every((id) => AI_CAPABILITY_HORIZON.capabilities.some((capability) => capability.id === id)));
  const supported = new Set(AI_CAPABILITY_HORIZON.sources.flatMap(({ supports }) => supports));
  assert.ok(AI_CAPABILITY_HORIZON.capabilities.every(({ id }) => supported.has(id)));
});

test("every country and industry inherits a complete common-business-function layer", () => {
  assert.equal(COMMON_BUSINESS_FUNCTIONS.length, 8);
  assert.equal(new Set(COMMON_BUSINESS_FUNCTIONS.map(({ id }) => id)).size, 8);
  assert.ok(COMMON_BUSINESS_FUNCTIONS.every(({ opportunities }) => Object.keys(opportunities).join(",") === "standard,integrated,advanced"));
  assert.equal(COUNTRY_PRACTICAL_CONTEXTS.length * INDUSTRY_OUTLOOKS.length, 32);
});

test("marketing depth includes creation, scheduled publishing and bounded agency", () => {
  const marketing = COMMON_BUSINESS_FUNCTIONS.find(({ id }) => id === "marketing-brand");
  assert.ok(marketing);
  assert.match(marketing.opportunities.standard.outcome, /posts.*images.*short videos/i);
  assert.match(marketing.opportunities.integrated.outcome, /schedule approved material/i);
  assert.match(`${marketing.opportunities.advanced.title} ${marketing.opportunities.advanced.outcome}`, /agent/i);
  assert.match(marketing.opportunities.advanced.humanBoundary, /approve publication and spend/i);
});

test("law-firm public outlook separates current capability depth from experimental scoring", () => {
  const outlook = INDUSTRY_OUTLOOKS.find(({ slug }) => slug === "law-firms");
  assert.ok(outlook);
  assert.match(outlook.tiers[0]?.description ?? "", /language, document, voice or image/);
  assert.ok(outlook.tiers[2]?.useCases.some(({ title }) => /Agentic|agents/.test(title)));
  assert.ok(outlook.tiers[2]?.useCases.some(({ title }) => /Multimodal/.test(title)));
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

test("Canada law firms use one disclosed sector proxy for hypothetical headroom", () => {
  const snapshot = getIndustryAdoptionHeadroom("law-firms", "canada");
  assert.equal(snapshot.status, "available");
  if (snapshot.status !== "available") return;
  assert.equal(snapshot.destination.value, 100);
  assert.equal(snapshot.actual.value, 31.7);
  assert.equal(snapshot.actual.evidenceRelation, "proxy");
  assert.match(snapshot.actual.sectorLabel, /Professional, scientific and technical services/);
  assert.match(snapshot.actual.mappingNote, /Broader than the selected industry/);
  assert.equal(snapshot.headroom.value, 68.3);
  assert.equal(snapshot.headroom.formula, "100.0 − 31.7 = 68.3 percentage points");
});

test("every covered country and industry has exactly one reproducible snapshot", () => {
  for (const country of ["united-states", "united-kingdom", "canada"]) {
    for (const industry of getIndustrySummaries()) {
      const first = getIndustryAdoptionHeadroom(industry.slug, country);
      const second = getIndustryAdoptionHeadroom(industry.slug, country);
      assert.equal(first.status, "available", `${country}/${industry.slug}`);
      assert.deepEqual(first, second);
    }
  }
});

test("missing country evidence leaves Actual and hypothetical gap empty, never zero", () => {
  for (const industry of getIndustrySummaries()) {
    const snapshot = getIndustryAdoptionHeadroom(industry.slug, "ghana");
    assert.equal(snapshot.status, "insufficient");
    if (snapshot.status !== "insufficient") continue;
    assert.equal(snapshot.actual.value, null);
    assert.equal(snapshot.headroom.value, null);
    assert.notEqual(snapshot.actual.value, 0);
    assert.notEqual(snapshot.headroom.value, 0);
    assert.match(snapshot.reason, /cannot be calculated/);
  }
});

test("a country selection is required before hypothetical headroom is calculated", () => {
  const snapshot = getIndustryAdoptionHeadroom("restaurants");
  assert.equal(snapshot.status, "insufficient");
  if (snapshot.status !== "insufficient") return;
  assert.equal(snapshot.country, null);
  assert.equal(snapshot.actual.value, null);
  assert.equal(snapshot.headroom.value, null);
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
  for (const internalLabel of ["Task risk cap", "Required human oversight cap", "Recommended AI role cap"]) {
    assert.equal(renderedView.includes(internalLabel), false);
  }
});

test("law-firm AI depth levels do not repeat the same task", () => {
  const view = getLawFirmIndustryView();
  const taskIds = view.workflowGroups.flatMap((group) => group.tasks.map((task) => task.id));
  assert.equal(new Set(taskIds).size, taskIds.length);
  assert.equal(taskIds.length, view.functions.flatMap((businessFunction) => businessFunction.tasks).length);
});
