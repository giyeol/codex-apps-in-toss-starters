import assert from "node:assert/strict";
import test from "node:test";
import { targetMatrix } from "../kits.mjs";
test("creates four starters and four complete examples", () => {
  const targets = targetMatrix();
  assert.equal(targets.length, 8);
  assert.deepEqual(
    targets.map(({ kit, flavor }) => flavor.outputDirectory + "/" + kit.id),
    [
      "starter-kits/01-weekend-activities",
      "complete-examples/01-weekend-activities",
      "starter-kits/02-habit-challenge",
      "complete-examples/02-habit-challenge",
      "starter-kits/03-travel-style-test",
      "complete-examples/03-travel-style-test",
      "starter-kits/04-gift-finder",
      "complete-examples/04-gift-finder",
    ],
  );
});
