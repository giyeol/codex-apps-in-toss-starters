import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { targetMatrix } from "../kits.mjs";
import { forbiddenFileReason } from "../scripts/lib/public-safety.mjs";
import { unresolvedCourseTokens } from "../scripts/lib/template.mjs";

function files(root) {
  return readdirSync(root, { withFileTypes: true })
    .filter(
      (entry) => !["node_modules", "dist", "coverage"].includes(entry.name),
    )
    .flatMap((entry) => {
      const file = join(root, entry.name);
      return entry.isDirectory() ? files(file) : [file];
    });
}

function assertInOrder(text, fragments, label) {
  let previous = -1;
  for (const fragment of fragments) {
    const current = text.indexOf(fragment, previous + 1);
    assert.ok(current > previous, `${label}: missing or out of order: ${fragment}`);
    previous = current;
  }
}

test("generated projects are independent and complete", () => {
  for (const { kit, flavor } of targetMatrix()) {
    const root = join(flavor.outputDirectory, kit.id);
    for (const file of [
      "package.json",
      "pnpm-lock.yaml",
      "pnpm-workspace.yaml",
      "apps-in-toss.config.ts",
      "service.config.json",
      "START_HERE.md",
      "README.md",
      "AGENTS.md",
      "SERVICE_BRIEF.md",
      "PROMPTS.md",
      "QR_CHECKLIST.md",
    ])
      assert.ok(existsSync(join(root, file)), root + "/" + file);
    const pkg = readFileSync(join(root, "package.json"), "utf8");
    assert.match(pkg, /"build:qr"/);
    assert.ok(!pkg.includes("workspace:") && !pkg.includes("file:../../"));
    const workspace = readFileSync(join(root, "pnpm-workspace.yaml"), "utf8");
    assert.ok(!workspace.includes("packages:"));
    assert.match(workspace, /esbuild: true/);
    assert.match(workspace, /protobufjs: true/);
    const startHere = readFileSync(join(root, "START_HERE.md"), "utf8");
    assert.match(startHere, new RegExp(kit.displayName));
    assert.match(startHere, /starter|complete/);
    assert.match(startHere, /README\.md/);
    const readme = readFileSync(join(root, "README.md"), "utf8");
    const agents = readFileSync(join(root, "AGENTS.md"), "utf8");
    assert.match(readme, new RegExp(`^# ${kit.displayName}$`, "m"));
    assertInOrder(
      readme,
      [
        "이 폴더",
        "SERVICE_BRIEF.md",
        "pnpm install",
        "필요한 도구",
        "pnpm doctor",
        "pnpm setup",
        "pnpm dev",
        "PROMPTS.md",
        "pnpm check",
        "첫 `.ait`",
        "두 번째 QR",
      ],
      `${root}/README.md learner flow`,
    );
    if (flavor.id === "complete")
      assert.match(startHere, /선택 확장|확장 기능/);
    for (const doc of [
      readme,
      agents,
      readFileSync(join(root, "PROMPTS.md"), "utf8"),
    ]) {
      assert.doesNotMatch(doc, /src\/theme\.ts/);
      assert.match(doc, /src\/content/);
      assert.match(doc, /src\/platform/);
    }
    assert.match(agents, /앱을 처음부터 다시 만들기/);
    assert.match(agents, /pnpm build:qr/);
    for (const file of files(root)) {
      const relative = file.slice(root.length + 1);
      assert.equal(forbiddenFileReason(relative), null, `${root}/${relative}`);
      if (statSync(file).size < 1_000_000)
        assert.deepEqual(
          unresolvedCourseTokens(readFileSync(file, "utf8")),
          [],
          `${root}/${relative}`,
        );
    }
  }
});
