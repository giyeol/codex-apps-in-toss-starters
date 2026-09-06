import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdtemp, mkdir, readFile, rename, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  copyOptionalTree,
  assertGeneratedTarget,
  publishStagedOutputs,
} from "../scripts/lib/generation.mjs";

test("accepts only the declared generated project path", () => {
  assert.doesNotThrow(() => assertGeneratedTarget("/repo", "/repo/app"));
  assert.throws(
    () => assertGeneratedTarget("/repo", "/repo/app/nested"),
    /non-generated/,
  );
  assert.throws(
    () => assertGeneratedTarget("/repo", "/repo/docs"),
    /non-generated/,
  );
  assert.throws(
    () => assertGeneratedTarget("/repo", "/repo/app/../docs"),
    /non-generated/,
  );
  assert.throws(
    () => assertGeneratedTarget("/repo", "/repo"),
    /non-generated/,
  );
});

test("missing optional overlay is ignored", async () => {
  await assert.doesNotReject(() =>
    copyOptionalTree(
      async () => {
        const error = new Error("missing");
        error.code = "ENOENT";
        throw error;
      },
      "missing",
      "target",
    ),
  );
});

test("rejects an output root symlink before any mutation", async () => {
  const root = await mkdtemp(join(tmpdir(), "generation-link-"));
  const outside = await mkdtemp(join(tmpdir(), "generation-outside-"));
  await symlink(outside, join(root, "app"));
  await assert.rejects(
    () => publishStagedOutputs(root, [{ stage: outside, final: join(root, "app") }]),
    /symbolic-link output ancestor/,
  );
});

test("restores every original after an injected mid-publication failure", async () => {
  const root = await mkdtemp(join(tmpdir(), "generation-rollback-"));
  const staged = join(root, "stage");
  const names = ["one", "two"];
  const outputs = names.map((name) => ({
    stage: join(staged, name), final: join(root, name),
  }));
  for (const output of outputs) {
    await mkdir(output.stage, { recursive: true });
    await writeFile(join(output.stage, "value.txt"), `new-${output.final}`);
    await mkdir(output.final, { recursive: true });
    await writeFile(join(output.final, "value.txt"), `old-${output.final}`);
  }
  let calls = 0;
  await assert.rejects(() => publishStagedOutputs(root, outputs, {
    generatedPaths: new Set(names),
    renameFn: async (from, to) => {
      calls += 1;
      if (calls === 4) throw new Error("injected publication failure");
      return rename(from, to);
    },
  }), /injected publication failure/);
  for (const output of outputs) {
    assert.equal(await readFile(join(output.final, "value.txt"), "utf8"), `old-${output.final}`);
    assert.equal(existsSync(`${output.final}.incoming`), false);
    assert.equal(existsSync(`${output.final}.backup`), false);
  }
});
