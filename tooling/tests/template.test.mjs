import assert from "node:assert/strict";
import test from "node:test";
import {
  renderText,
  unresolvedCourseTokens,
} from "../scripts/lib/template.mjs";
test("replaces every declared token", () =>
  assert.equal(
    renderText("{{COURSE_DISPLAY_NAME}} / {{COURSE_KIT_ID}}", {
      DISPLAY_NAME: "주말 활동 모음",
      KIT_ID: "01-weekend-activities",
    }),
    "주말 활동 모음 / 01-weekend-activities",
  ));
test("rejects unresolved tokens", () =>
  assert.throws(
    () => renderText("{{COURSE_UNKNOWN}}", {}),
    /Unresolved template token: UNKNOWN/,
  ));
test("detects legacy markdown token forms", () => {
  for (const source of [
    "{{COURSE_DISPLAY_NAME}}",
    "__COURSE_DISPLAY_NAME__",
    "**COURSE_DISPLAY_NAME**",
  ])
    assert.deepEqual(unresolvedCourseTokens(source), ["DISPLAY_NAME"]);
});
