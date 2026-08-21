import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { kits } from "../kits.mjs";

test("each complete example preserves and extends its matching starter", () => {
  for (const kit of kits) {
    const starter = readFileSync(
      join("starter-kits", kit.id, "src/features/active/index.tsx"),
      "utf8",
    );
    const complete = readFileSync(
      join("complete-examples", kit.id, "src/features/active/index.tsx"),
      "utf8",
    );
    assert.notEqual(starter, complete, `${kit.id} feature source must differ`);
    assert.match(starter, /const isComplete = String\("starter"\) === "complete"/);
    assert.match(complete, /const isComplete = String\("complete"\) === "complete"/);
  }
});
