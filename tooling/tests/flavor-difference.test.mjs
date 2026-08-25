import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { kits } from "../kits.mjs";

const completeExtensions = {
  "01-weekend-activities": /freeFirst\(/,
  "02-habit-challenge": /3일/,
  "03-travel-style-test": /결과 문구 복사/,
  "04-gift-finder": /예상 가격/,
};
const conditionalExtensions = {
  "03-travel-style-test": /\{isComplete && \([\s\S]*?결과 문구 복사하기/,
  "04-gift-finder": /\{isComplete && \([\s\S]*?예상 가격/,
};

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
    assert.match(
      starter,
      /const isComplete = String\("starter"\) === "complete"/,
    );
    assert.match(
      complete,
      /const isComplete = String\("complete"\) === "complete"/,
    );
    assert.match(complete, completeExtensions[kit.id]);
    if (kit.id in conditionalExtensions) {
      assert.match(starter, conditionalExtensions[kit.id]);
      assert.match(complete, conditionalExtensions[kit.id]);
    }
  }
});
