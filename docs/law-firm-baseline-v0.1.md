# Law Firm Practical AI Baseline v0.1

## Scope

This is the first working vertical slice of the Possible engine. It represents a small/medium general law firm with lawyers, paralegal support, and legal administration. It is a pre-country technological/business baseline: no country modifier and no Actual/adoption input is used.

The task model adapts current O*NET descriptions for lawyers (23-1011.00), paralegals and legal assistants (23-2011.00), and legal secretaries and administrative assistants (43-6012.00). The adaptation groups occupational work into reusable business functions and outcome-oriented tasks; it is not an assertion that every firm allocates work identically.

## Version 0.1 experimental weights

For each task-capability mapping, the calculator forms a 0–100 uncapped practicality score:

```text
25% task-specific technical applicability
15% maturity
10% affordability
15% reliability
10% integration ease
10% oversight suitability
15% risk suitability
```

All factor values use a 0–1 scale where higher means more practical. For integration difficulty, oversight requirement, and risk, the stored normalized value is the corresponding **suitability** value, so a more difficult or risky capability receives a lower value.

When multiple capabilities support a task, explicit contribution weights combine their factor values. Those weights express coverage of the task, not scientific certainty.

Task-level caps are then applied:

| Dimension | Caps |
|---|---|
| Risk | low 100; moderate 78; high 45; unacceptable 0 |
| Human oversight | minimal 100; routine 88; substantial 62; continuous 40 |
| Recommended role | assist 68; augment 74; partially automate 88; mostly automate 100; not practically appropriate 0 |

The task score is the minimum of the uncapped score and all applicable caps. This intentionally prevents strong text generation from being interpreted as permission to automate legal judgment, final advice, negotiation, or advocacy.

Function scores are weighted averages of their tasks. The overall baseline is a weighted average of function scores. Function and task weights are explicit in `src/data/law-firm-model.ts`; they are Version 0.1 judgments intended for review and sensitivity testing.

## Evidence basis

Capability availability and affordability use current provider documentation and pricing. Semantic search and transcription use the corresponding API documentation. Reliability and risk are constrained by NIST's Generative AI Profile, independent research on hallucinations in legal-research products, and ABA Formal Opinion 512 on lawyers' professional obligations when using generative AI.

Provider documentation establishes availability, not independent reliability. Capability evidence records therefore state their role and limitations, and no capability receives high practicality solely from a vendor claim.

## Traceability

The report retains references from:

```text
overall baseline
  -> weighted business functions
  -> weighted tasks and task-level caps
  -> task-capability mappings
  -> dated AI capability versions
  -> capability evidence records and source metadata
```

Run `npm run baseline:law-firm` to inspect the calculated report.

## Known limitations

- Factor values, mapping contribution weights, task weights, function weights, and caps are transparent expert judgments, not empirically validated coefficients.
- The model is representative rather than a time-and-motion study of a specific firm.
- O*NET is US-oriented, although this version does not produce a US country score.
- Capability assessments can become stale quickly and need a defined review cadence.
- Product documentation demonstrates availability, while independent evidence for task-specific accuracy remains uneven.
- Affordability includes accessible usage pricing but not a full total-cost-of-ownership model for security, integration, change management, and training.
