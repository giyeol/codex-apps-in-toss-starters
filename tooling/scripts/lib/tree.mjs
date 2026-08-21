import { createHash } from "node:crypto";
import { cp, lstat, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, extname, join, relative } from "node:path";
import { renderText } from "./template.mjs";

const IGNORED_NAMES = new Set(["node_modules", "dist", ".git", "coverage"]);
export async function copyTree(source, target) {
  await cp(source, target, {
    recursive: true,
    force: true,
    filter: (path) => !IGNORED_NAMES.has(path.split(/[\\/]/).at(-1) ?? ""),
  });
}
export async function renderTree(root, values) {
  const textExtensions = new Set([
    ".css",
    ".html",
    ".js",
    ".json",
    ".jsx",
    ".md",
    ".mjs",
    ".ts",
    ".tsx",
    ".txt",
    ".yaml",
    ".yml",
  ]);
  for (const file of await listFiles(root)) {
    if (
      !textExtensions.has(extname(file)) &&
      ![".gitignore", ".nvmrc"].includes(basename(file))
    )
      continue;
    await writeFile(
      file,
      renderText(await readFile(file, "utf8"), values),
      "utf8",
    );
  }
}
export async function treeDigest(root) {
  const hash = createHash("sha256");
  for (const file of await listFiles(root)) {
    const name = relative(root, file);
    if (name.endsWith(".ait") || name.startsWith("dist/")) continue;
    hash.update(name);
    hash.update(await readFile(file));
  }
  return hash.digest("hex");
}
async function listFiles(root) {
  const output = [];
  for (const name of (await readdir(root)).sort()) {
    if (IGNORED_NAMES.has(name)) continue;
    const path = join(root, name);
    const info = await lstat(path);
    if (info.isSymbolicLink())
      throw new Error(`Refusing to follow symbolic link: ${path}`);
    if (info.isDirectory()) output.push(...(await listFiles(path)));
    else output.push(path);
  }
  return output;
}
