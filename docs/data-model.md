# Initial data model

## Design principles

- Stable concepts are separated from time-varying assessments.
- The Possible and Actual input graphs do not depend on each other.
- External classifications are mapped rather than embedded in internal industry IDs.
- Missing, observed, inherited, and modeled values are explicit states.
- Scores are immutable outputs tied to a score version and complete input lineage.
- IDs in the TypeScript contracts are strings; production storage may use UUIDs or another stable scheme.

The initial design is relational in shape but can be implemented in SQL, document storage, or typed files. Fields listed here are the important logical fields rather than a finalized physical schema.

## Shared reference entities

### `countries`

`id`, `name`, `iso2`, `iso3`, optional `aliases`, `active`, timestamps. Country IDs are internal stable keys; ISO codes support interoperability.

### `industries`

`id`, `name`, `description`, optional `parentIndustryId`, `active`, timestamps. Parent links form a controlled internal hierarchy.

### `industry_classification_mappings`

Maps an internal industry to an external classification: `id`, `industryId`, `system`, `systemVersion`, `code`, `label`, `countryId` when country-specific, mapping relation (`exact`, `broader`, `narrower`, `overlap`), confidence, effective dates, and notes.

### `business_archetypes`

`id`, `slug`, `name`, `description`, optional related `industryIds`, `active`, timestamps. An archetype may span multiple industry codes and is not a synonym for industry.

### `firm_sizes`

`id`, `slug`, `name`, `ordinal`, description, and active flag. Numeric bounds belong in contextual `FirmSizeDefinition` records because official thresholds differ.

### `firm_size_definitions`

`id`, `firmSizeId`, optional `countryId` and `sourceId`, metric (`employees`, `revenue`, or other), lower/upper bounds, currency if relevant, inclusivity rules, effective dates, and notes.

### `business_functions`

`id`, `slug`, `name`, `description`, optional parent function, and active flag.

### `occupations`

`id`, `name`, description, optional external classification system/code/version, optional country, and active flag.

### `tasks`

`id`, `name`, description, `businessFunctionId`, optional parent task, frequency/unit notes, active flag, timestamps. A join table (`occupation_tasks`) links occupations and tasks with importance/frequency metadata.

## Possible engine

### `ai_capabilities`

Stable identity and description: `id`, `slug`, `name`, `description`, category, active flag, timestamps. It contains no time-sensitive assessment.

### `ai_capability_versions`

A dated assessment of a capability: `id`, `capabilityId`, semantic/version label, status, effective period, assessed timestamp, technical applicability, maturity, affordability, reliability, integration difficulty, human oversight, risk, limitations, and evidence references. Each practicality factor uses a configurable ordinal/normalized rating plus rationale; no universal aggregation weights are fixed.

### `capability_evidence`

Evidence supporting a capability version: `id`, `capabilityVersionId`, source citation/URL, publisher, dates, evidence type, supported factors, excerpt locator, notes, and confidence/evidence metadata. It is separate from adoption evidence and cannot count as adoption measurement.

### `task_capability_mappings`

Joins a specific task to a specific capability version: `id`, `taskId`, `capabilityVersionId`, support mode (`assist`, `automate_part`, `automate_end_to_end`, `augment_decision`), applicability rating, coverage notes, prerequisites, constraints, human role, evidence references, effective dates, and version.

### `industry_task_weights`

Defines task relevance for an analysis segment: `id`, `industryId` and/or `businessArchetypeId`, optional `firmSizeId`, `taskId`, weight value, scale, basis, evidence, effective dates, and version. At least one of industry or archetype is required. A score version determines normalization and aggregation.

### `country_modifiers`

`id`, `countryId`, factor, optional scope by capability/task/industry/archetype/firm size, direction/value/range, scale, rationale, supporting evidence, effective dates, version, and confidence. Modifiers reflect practicality inputs and must not derive from adoption outcomes.

### `baseline_scores`

Immutable output: `id`, segment scope, as-of date, score version, score result (or missing result), confidence, `inputSnapshot` references to capability versions, mappings, weights, and modifiers, optional contribution breakdown, calculation timestamp, and supersession metadata.

## Actual engine

### `adoption_sources`

Source-level citation: `id`, title, publisher, URL, publication/access dates, source type, methodology summary, default AI definition, and notes. Evidence grade is not permanently assigned here because grade depends on an observation's intended use.

### `adoption_observations`

One extracted measurement: `id`, `sourceId`, source locator/question wording, observation period, geography, source category and mapped industry/archetype/firm size, sample metadata, AI definition, denominator, measured concept, unit, discriminated value state, provenance (`observed`, `inherited`, `modeled`), evidence assessment, confidence, methodology/extraction notes, lineage, and timestamps.

Every observation also carries an `ActualComparisonMapping`: nullable business-function and task IDs, nullable utilization depth (`standard`, `integrated`, `advanced`), direct/proxy relation for the intended comparison, geography, evidence confidence, observed/modeled basis, measured-construct classification, nullable normalized-scale ID, and mapping rationale. Null task/depth fields mean “not reported at this level,” not zero. Broad sector observations are deliberately represented this way.

An inherited observation references its parent observation and explains mismatches. A modeled observation references a model version and all inputs. A missing observation contains a reason rather than a numeric value.

### `adoption_scores`

Immutable normalized output: `id`, segment scope, observation period/as-of date, score version, result or missing reason, evidence grade, confidence, observation input references, transformations, calculation timestamp, and supersession metadata. A score may synthesize observations only according to the score version.

## Comparison and history

### `gap_scores`

`id`, exact `baselineScoreId`, `adoptionScoreId` when present, segment scope, gap status (`numeric`, `directional`, `insufficient`), numeric value only for a numeric result, direction only for a directional result, explicit reason code for an insufficient result, compatibility checks, evidence coverage, confidence, score version, calculation timestamp, and notes.

### `confidence_evidence_metadata`

In the initial TypeScript model this is embedded as reusable `EvidenceAssessment` and `Confidence` value objects. A database may normalize it if audit queries require. It records grade, rationale, strengths/limitations, qualitative confidence, and optional justified interval.

### `score_versions`

`id`, score kind, version, status, construct, output scale, algorithm identifier, configuration (including experimental weights), compatibility key, input cutoff, released/effective dates, changelog, and owner. Configuration is data, not hard-coded into entity contracts.

### `score_history`

Append-only index over scores: `id`, score kind, score ID, segment key, version ID, event (`created`, `superseded`, `withdrawn`), timestamp, optional previous score ID, reason, and actor. Scores themselves remain immutable.

## Relationship map

```text
AI capability -> capability version -> task-capability mapping <- task
                       |                         |
             capability evidence         industry/task weight
                                                 |
country modifier --------------------------> baseline score

adoption source -> adoption observation -> adoption score
                       ^       |
                       |       +-> inherited/model lineage
                       +---------- parent observation

baseline score + adoption score -> gap score
         \             |              /
          +-------- score version ----+
                    |
               score history
```

There is deliberately no edge from adoption observations/scores to capability versions, task mappings, weights, country modifiers, or baseline scores.

## Integrity constraints

1. All score records reference exactly one immutable score version of the corresponding kind.
2. A capability version has an effective date and at least one supporting evidence reference before production use.
3. A task-capability mapping references a capability **version**, not only a stable capability.
4. A country modifier records independent supporting evidence and may not reference an adoption score as its derivation.
5. An observation with `missing` value contains no numeric value.
6. Inherited provenance requires a parent observation and inheritance rationale.
7. Modeled provenance requires a model version, input references, and method description.
8. A numeric gap requires task/depth/geography-aligned Possible and Actual point values on the same declared normalized scale plus minimum direct evidence coverage.
9. A directional gap requires deterministic thresholds and minimum aligned evidence coverage; a missing or incompatible input yields an `insufficient` result with no value or direction.
10. Broad country or sector adoption prevalence is never a direct task-level utilization observation.
11. Supersession appends history and never mutates the historical score.

## Seed-data boundary

The `data/seeds` directory contains only countries, archetypes, and named size bands. It intentionally contains no industries, thresholds, task weights, AI capability ratings, adoption observations, percentages, modifiers, or scores. Those require researched definitions and evidence.

## TypeScript mapping

The contracts are split by concern:

- `src/types/common.ts` — identifiers, dates, confidence, evidence, and value states;
- `src/types/reference.ts` — countries, industries, archetypes, functions, occupations, and tasks;
- `src/types/possible.ts` — AI capability and baseline entities;
- `src/types/actual.ts` — sources, observations, and adoption scores;
- `src/types/scoring.ts` — score versions, gaps, lineage, and history.

These are domain contracts, not a commitment to a database vendor or final scoring formula.
