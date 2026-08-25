import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = join("tooling", "base", "public", "tossface");
const expected = [
  "books.svg",
  "cake.svg",
  "candle.svg",
  "cityscape.svg",
  "compass.svg",
  "croissant.svg",
  "fire.svg",
  "gift.svg",
  "map.svg",
  "plant.svg",
  "seedling.svg",
  "smile.svg",
  "tea.svg",
  "tumbler.svg",
];

test("pins the selected official Tossface assets", () => {
  const manifest = JSON.parse(
    readFileSync(join(root, "manifest.json"), "utf8"),
  );

  assert.equal(manifest.version, "v1.6.1");
  assert.deepEqual(Object.keys(manifest.assets).sort(), expected);
  for (const name of expected) {
    assert.match(readFileSync(join(root, name), "utf8"), /<svg\b/);
  }
  assert.match(readFileSync(join(root, "LICENSE"), "utf8"), /Tossface/i);
});
