import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "../project.mjs";
import { copyTree, renderTree, treeDigest } from "./lib/tree.mjs";
import { publishStagedOutputs } from "./lib/generation.mjs";
const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const checkOnly = process.argv.includes("--check");
const stageRoot = await mkdtemp(join(tmpdir(), "aiers-app-"));
try {
  const staged = [];
  for (const project of projects) {
    const target = join(stageRoot, project.outputDirectory);
    await mkdir(target, { recursive: true });
    await copyTree(join(repositoryRoot, "tooling/base"), target);
    await renderTree(target, {
      KIT_ID: project.id,
      DISPLAY_NAME: project.displayName,
      APP_NAME: project.demoAppName,
      FEATURE_NAME: project.feature,
      PRIMARY_COLOR: project.primaryColor,
      TAGLINE: project.tagline,
    });
    const packagePath = join(target, "package.json");
    const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
    packageJson.name = project.packageName;
    await writeFile(packagePath, JSON.stringify(packageJson, null, 2) + "\n");
    staged.push({
      stage: target,
      final: join(repositoryRoot, project.outputDirectory),
    });
  }
  if (checkOnly) {
    for (const entry of staged) {
      if ((await treeDigest(entry.final)) !== (await treeDigest(entry.stage)))
        throw new Error("Generated output is stale: " + entry.final);
    }
  } else await publishStagedOutputs(repositoryRoot, staged);
} finally {
  await rm(stageRoot, { recursive: true, force: true });
}
console.log(
  checkOnly
    ? "Generated output is current."
    : `Generated ${projects.length} course project(s).`,
);
