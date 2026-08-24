# Artificial Intelligence Business Index

This repository contains the public web application, methodology, and data foundation for exploring:

- **Practical AI applications:** what industries can do with current AI at standard, integrated, and advanced human-led levels;
- **Regional context:** how country conditions affect those applications; and
- **Reported AI adoption:** what available evidence says businesses are currently doing.

Where the evidence is genuinely comparable, the application can surface the **AI utilization gap**. Missing or incompatible evidence is never treated as zero.

The homepage provides a five-step animated guide and an interactive ASCII globe. Visitors choose a country, industry, and AI integration level before viewing practical applications, available adoption evidence, and the gap.

## Repository layout

```text
app/               Next.js App Router pages and interface styles
components/        Interactive explorer, animated flow, and evidence views
docs/              Methodology, data model, and evidence policy
src/data/          Industry outlooks, capability evidence, and adoption data
src/types/         TypeScript domain contracts
data/seeds/        Country, industry, and business-archetype seeds
tests/             Baseline, evidence, and application-service tests
```

## Validation

```bash
npm run typecheck
npm run validate:seeds
npm test
```

Generate the first pre-country Possible-engine report with:

```bash
npm run baseline:law-firm
```

Install dependencies and run the public index locally:

```bash
npm install
npm run dev
```

Then open [http://127.0.0.1:3000](http://127.0.0.1:3000).

See [docs/methodology.md](docs/methodology.md) for the conceptual model and [docs/data-model.md](docs/data-model.md) for implementation guidance.
