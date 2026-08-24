import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readJson = async (name) =>
  JSON.parse(await readFile(new URL(`../data/seeds/${name}`, import.meta.url), "utf8"));

const [countries, archetypes, firmSizes] = await Promise.all([
  readJson("countries.json"),
  readJson("business-archetypes.json"),
  readJson("firm-sizes.json"),
]);

assert.equal(countries.length, 4, "Expected exactly four country seeds");
assert.deepEqual(
  new Set(countries.map(({ iso2 }) => iso2)),
  new Set(["US", "GB", "CA", "GH"]),
  "Unexpected country codes",
);

assert.equal(archetypes.length, 8, "Expected exactly eight archetype seeds");
assert.equal(firmSizes.length, 4, "Expected exactly four firm-size seeds");
assert.deepEqual(
  firmSizes.map(({ slug }) => slug),
  ["micro", "small", "medium", "large"],
  "Unexpected firm-size order",
);

for (const [name, rows] of Object.entries({ countries, archetypes, firmSizes })) {
  assert.equal(new Set(rows.map(({ id }) => id)).size, rows.length, `${name} IDs must be unique`);
  assert.ok(rows.every(({ active }) => active === true), `${name} seeds must be active`);
}

const forbiddenKeys = /adoption|percentage|score|weight|modifier/i;
for (const row of [...countries, ...archetypes, ...firmSizes]) {
  assert.ok(
    Object.keys(row).every((key) => !forbiddenKeys.test(key)),
    `Structural seeds must not contain scoring or adoption fields: ${row.id}`,
  );
}

console.log("Structural seed validation passed.");
