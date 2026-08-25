import { createHash } from "node:crypto";
import {
  mkdtemp,
  mkdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const version = "v1.6.1";
const assets = {
  "books.svg": "u1F4DA.svg",
  "cake.svg": "u1F370.svg",
  "candle.svg": "u1F56F.svg",
  "cityscape.svg": "u1F307.svg",
  "compass.svg": "u1F9ED.svg",
  "croissant.svg": "u1F950.svg",
  "fire.svg": "u1F525.svg",
  "gift.svg": "u1F381.svg",
  "map.svg": "u1F5FA.svg",
  "plant.svg": "u1FAB4.svg",
  "seedling.svg": "u1F331.svg",
  "smile.svg": "u1F60A.svg",
  "tea.svg": "u1F375.svg",
  "tumbler.svg": "u1F964.svg",
};
const rawRoot = `https://raw.githubusercontent.com/toss/tossface/${version}`;
const target = join(repositoryRoot, "tooling/base/public/tossface");
const backup = `${target}.backup-${process.pid}`;

async function download(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) {
    throw new Error(`Tossface download failed (${response.status}): ${url}`);
  }
  return response.text();
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

const stage = await mkdtemp(join(tmpdir(), "aiers-tossface-"));
let targetBackedUp = false;
try {
  const manifest = { assets: {}, source: rawRoot, version };
  for (const [name, sourceName] of Object.entries(assets)) {
    const source = `${rawRoot}/dist/svg/${sourceName}`;
    const svg = await download(source);
    if (!/<svg\b/.test(svg)) {
      throw new Error(`Downloaded Tossface asset is not SVG: ${source}`);
    }
    await writeFile(join(stage, name), svg);
    manifest.assets[name] = { sha256: sha256(svg), source };
  }

  const license = await download(`${rawRoot}/LICENSE`);
  if (!/tossface|토스페이스/i.test(license)) {
    throw new Error("Downloaded Tossface license is invalid.");
  }
  await writeFile(join(stage, "LICENSE"), license);
  await writeFile(
    join(stage, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  await mkdir(dirname(target), { recursive: true });
  try {
    await rename(target, backup);
    targetBackedUp = true;
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  try {
    await rename(stage, target);
  } catch (error) {
    if (targetBackedUp) await rename(backup, target);
    throw error;
  }
  if (targetBackedUp) await rm(backup, { force: true, recursive: true });

  const savedManifest = JSON.parse(
    await readFile(join(target, "manifest.json"), "utf8"),
  );
  console.log(
    `Synced ${Object.keys(savedManifest.assets).length} Tossface assets at ${version}.`,
  );
} finally {
  await rm(stage, { force: true, recursive: true });
  await rm(backup, { force: true, recursive: true });
}
