import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { targetMatrix } from "../kits.mjs";
import { copyTree, renderTree, treeDigest } from "./lib/tree.mjs";
import { copyOptionalTree, publishStagedOutputs } from "./lib/generation.mjs";
const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const checkOnly = process.argv.includes("--check");
const stageRoot = await mkdtemp(join(tmpdir(), "aiers-kits-"));
try {
  const staged = [];
  for (const { kit, flavor } of targetMatrix()) {
    const target = join(stageRoot, flavor.outputDirectory, kit.id);
    await mkdir(target, { recursive: true });
    await copyTree(join(repositoryRoot, "tooling/base"), target);
    await copyTree(
      join(repositoryRoot, "tooling/overlays", kit.id, "shared"),
      target,
    );
    await copyOptionalTree(
      copyTree,
      join(repositoryRoot, "tooling/overlays", kit.id, flavor.id),
      target,
    );
    await renderTree(target, {
      KIT_ID: kit.id,
      DISPLAY_NAME: kit.displayName,
      APP_NAME: kit.demoAppName,
      FEATURE_NAME: kit.feature,
      PRIMARY_COLOR: kit.primaryColor,
      TAGLINE: kit.tagline,
      FLAVOR: flavor.id,
    });
    const packagePath = join(target, "package.json");
    const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
    packageJson.name = kit.packageName;
    await writeFile(packagePath, JSON.stringify(packageJson, null, 2) + "\n");
    staged.push({
      stage: target,
      final: join(repositoryRoot, flavor.outputDirectory, kit.id),
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
  checkOnly ? "Generated outputs are current." : "Generated 8 course projects.",
);
