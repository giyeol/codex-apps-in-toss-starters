import { spawnSync } from "node:child_process";
import { readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { targetMatrix } from "../kits.mjs";
import { assertPublicSafe } from "./lib/public-safety.mjs";

function run(project, args) {
  const result = spawnSync("pnpm", args, { cwd: project, stdio: "inherit" });
  if (result.status !== 0)
    throw new Error(`${project} failed: pnpm ${args.join(" ")}`);
}

for (const { kit, flavor } of targetMatrix()) {
  const project = join(flavor.outputDirectory, kit.id);
  for (const artifact of readdirSync(project).filter((name) =>
    name.endsWith(".ait"),
  ))
    rmSync(join(project, artifact));
  run(project, ["install", "--frozen-lockfile"]);
  run(project, ["lint"]);
  run(project, ["check"]);
  run(project, ["build"]);
  const artifacts = readdirSync(project).filter((name) =>
    name.endsWith(".ait"),
  );
  if (artifacts.length !== 1)
    throw new Error(`${project} must produce exactly one fresh root .ait`);
  console.log(
    `[PASS] ${project} ${artifacts[0]} ${statSync(join(project, artifacts[0])).size} bytes`,
  );
}
await assertPublicSafe(process.cwd());
