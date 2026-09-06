import assert from "node:assert/strict";
import test from "node:test";
import { project, projects } from "../project.mjs";

test("generates exactly one shared practice project at app/", () => {
  assert.equal(projects.length, 1);
  assert.equal(projects[0], project);
  assert.equal(project.outputDirectory, "app");
  assert.equal(project.displayName, "선물 뽑기");
  assert.match(project.demoAppName, /^course-/);
  assert.match(project.primaryColor, /^#[0-9A-F]{6}$/);
});
