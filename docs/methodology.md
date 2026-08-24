# Artificial Intelligence Business Index methodology

## Purpose and scope

The Artificial Intelligence Business Index measures the distance between what businesses can practically accomplish with current AI and what credible evidence shows they are actually doing. It is a measurement framework, not a forecast of theoretical AI potential.

The framework has two independent engines:

```text
Current AI capabilities
  -> business tasks
  -> industry and business archetype
  -> firm size
  -> country practicality adjustments
  -> Practical AI Baseline

Adoption evidence sources
  -> raw observations
  -> normalization
  -> confidence and evidence quality
  -> Actual AI Utilization
```

Only after both engines have produced compatible, versioned scores are they compared:

`AI Utilization Gap = Practical AI Baseline - Actual AI Utilization`

The initial geographic scope is the United States, United Kingdom, Canada, and Ghana. The architecture may later support other geographies and classification systems.

## Core definitions

### Practical AI Baseline

A reproducible estimate of how much of the relevant work for a defined business segment can reasonably be supported by currently available AI. A segment is defined by country, industry, business archetype, firm size, and effective date.

The baseline is derived from versioned AI capabilities, their applicability to business tasks, task importance, and practicality factors. It is not a maximum technical ceiling. Maturity, affordability, reliability, integration difficulty, required human oversight, risk, and country conditions all constrain the result. Actual adoption statistics are prohibited inputs to this calculation.

### Actual AI Utilization

A normalized representation of measured AI use in a defined population and period, derived from external evidence. It must retain the source's population, geography, industry definition, AI definition, denominator, method, and uncertainty. An actual-utilization value may be observed directly, inherited from a broader category, modeled in a future methodology, or missing; those states must remain distinguishable.

### AI Utilization Gap

The difference between compatible Practical AI Baseline and Actual AI Utilization scores for the same scope and score version. A gap is calculated only when the two inputs use compatible constructs, units, segment definitions, and dates. A positive result indicates measured utilization below the practical baseline; a negative result, if valid, indicates measured utilization above it. A missing adoption score produces a missing gap, not a zero.

### AI Capability

A stable description of a distinct AI-enabled ability, such as extracting structured data from documents. The stable capability identity is separate from its changing performance and practicality.

### Business Task

A discrete, outcome-oriented unit of work performed by a person or system. Tasks are the bridge between AI capabilities and businesses. A task can belong to a business function and may be associated with occupations.

### Business Function

A cross-industry area of organizational activity, such as finance, marketing, customer service, operations, human resources, legal/compliance, or information technology.

### Industry

An economic activity category represented independently of any one national classification system. Mappings connect the internal industry to external codes such as NAICS, UK SIC, or ISIC and preserve mapping confidence and scope.

### Business Archetype

A recognizable operating model within or across industries, such as a law firm or restaurant. It supplies a practical task profile that an industry code alone may not capture.

### Firm Size

A named size band—initially micro, small, medium, or large—whose numeric boundaries are defined in context. Employee or revenue thresholds may differ by country, source, and analysis; therefore the band and its applicable threshold definition must both be retained.

### Country Modifier

A versioned, evidenced adjustment to practicality in a country for a specified factor and scope. Examples may include language coverage, digital infrastructure, labor economics, regulation, data access, or availability of AI products. It modifies the Possible engine only and cannot be reverse-engineered from adoption rates.

### Adoption Observation

One evidence-bearing measurement from a source, before or after an explicitly recorded normalization. It records the measured concept, value state, population, time period, source definition, evidence lineage, and uncertainty. One source may yield multiple observations.

### Evidence Grade

An ordinal assessment of how directly and credibly an observation supports a particular country-industry estimate. Grades A through D and Insufficient are defined in the evidence policy. Grade is contextual rather than a permanent property of a publisher.

### Confidence

A structured statement about uncertainty in an input or result. It combines a qualitative level, the reasons for that judgment, and a numeric interval when defensible. Confidence is not the same as evidence grade: grade assesses source fit and strength, while confidence concerns the uncertainty of the value used.

### Score Version

An immutable specification of the scoring method, including construct, scale, formula or algorithm identifier, configuration, input-data cutoff, and release time. It makes results reproducible and prevents comparisons across incompatible methodologies.

## Non-negotiable rules

1. **Possible and Actual are independent.** Actual adoption evidence must not influence the Practical AI Baseline. Capability assessments, vendor claims, or intuition must not be used as adoption observations.
2. **Potential means currently practical.** Include only capabilities available, sufficiently mature, and economically sensible as of the capability version's effective date—not speculative research or expected future products.
3. **Practicality is multidimensional.** Technical applicability, maturity, affordability, reliability, integration difficulty, human oversight, and risk must be represented before a capability can contribute to a baseline.
4. **Missing remains missing.** Lack of defensible adoption evidence is represented as an explicit missing state. It is never treated as zero and is never silently imputed.
5. **Observed and modeled are different.** If modeled adoption estimates are introduced later, their method, inputs, and uncertainty must be declared. They must never be displayed or aggregated as though they were observed.
6. **Lineage is required.** Every score must ultimately be reproducible from immutable score versions, source observations, mappings, weights, modifiers, and transformations.
7. **Time and version are required.** AI capability versions, evidence observations, modifiers, and scores carry effective or observation dates plus version identifiers because the frontier changes.
8. **No false precision.** Stored precision does not imply measurement precision. Publication should use ranges or rounded values appropriate to evidence quality.

## Practical AI Baseline workflow

1. Define a stable AI capability and create a dated capability version.
2. Assess its technical applicability, maturity, affordability, reliability, integration difficulty, human oversight requirement, and risk with supporting evidence.
3. Map the capability version to tasks with a described support mode and applicability assessment.
4. Define task weights for the relevant industry or archetype and firm size. Weights are versioned and must state their basis.
5. Apply relevant, independently evidenced country modifiers.
6. Calculate a baseline with a declared score version and preserve all input references and contributions.

The types deliberately do not prescribe final factor weights or aggregation formulas. Those belong to a later, testable score version.

## Actual AI Utilization workflow

1. Register an adoption source and its publication metadata.
2. Extract raw observations without changing the source's meaning.
3. Record the value as a point, range, missing state, or other supported representation; classify it as observed, inherited, or modeled.
4. Map geography, industry, archetype, firm size, and measured concept explicitly.
5. Assign evidence grade and confidence for the intended estimate.
6. Normalize only when a declared transformation can create a comparable construct. Preserve the raw observation and transformation lineage.
7. Create an adoption score only when evidence is sufficient under the chosen score version. Otherwise record a missing score with a reason.

## Comparability and gap calculation

A gap calculation must confirm that both scores align on:

- country, industry/archetype, and firm-size scope;
- effective or observation period acceptable to the score version;
- unit, scale, and construct being measured; and
- compatible score versions or an explicit crosswalk.

If any required alignment fails, the gap status is `not_comparable`. If actual utilization is missing, the gap status is `missing_adoption`. Neither condition may produce a numeric gap.

## Reproducibility and change management

Records used in a published score are immutable. Corrections create replacement versions and retain the prior record. A score stores its complete input references and, where practical, contribution values. Recalculation under new evidence or methodology creates a new score-history entry rather than overwriting the old one.

Publication should state the as-of date, score version, evidence state, grade, confidence, and material limitations beside each result.
