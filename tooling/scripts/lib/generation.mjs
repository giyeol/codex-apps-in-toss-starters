import { cp, lstat, mkdir, rename, rm } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";

/** 생성기가 통째로 교체해도 되는, 저장소 루트 기준 경로예요. */
export const GENERATED_PATHS = new Set(["app"]);

export function assertGeneratedTarget(
  repositoryRoot,
  target,
  generatedPaths = GENERATED_PATHS,
) {
  const relativePath = relative(resolve(repositoryRoot), resolve(target));
  const segments = relativePath.split(/[\\/]+/);
  if (
    relativePath === "" ||
    relativePath.startsWith("..") ||
    segments.includes("..") ||
    !generatedPaths.has(segments.join("/"))
  ) {
    throw new Error(`Refusing to replace non-generated path: ${target}`);
  }
}

async function assertSafeOutputLocation(repositoryRoot, target) {
  const root = resolve(repositoryRoot);
  const parts = relative(root, resolve(target)).split(/[\\/]+/);
  let cursor = root;
  for (const part of parts) {
    cursor += sep + part;
    try {
      if ((await lstat(cursor)).isSymbolicLink())
        throw new Error(`Refusing symbolic-link output ancestor: ${cursor}`);
    } catch (error) {
      if (error && typeof error === "object" && error.code === "ENOENT") continue;
      throw error;
    }
  }
}

async function removeOwned(path) {
  try {
    const info = await lstat(path);
    if (info.isSymbolicLink()) throw new Error(`Refusing symbolic-link mutation: ${path}`);
    await rm(path, { recursive: true, force: true });
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") return;
    throw error;
  }
}

export async function copyOptionalTree(copyTree, source, target) {
  try {
    await copyTree(source, target);
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") return;
    throw error;
  }
}

export async function publishStagedOutputs(
  repositoryRoot,
  outputs,
  { renameFn = rename, generatedPaths = GENERATED_PATHS } = {},
) {
  const finals = new Set();
  for (const output of outputs) {
    assertGeneratedTarget(repositoryRoot, output.final, generatedPaths);
    await assertSafeOutputLocation(repositoryRoot, output.final);
    if (finals.has(resolve(output.final)))
      throw new Error(`Refusing duplicate generated target: ${output.final}`);
    finals.add(resolve(output.final));
  }

  const incoming = [];
  const replaced = [];
  try {
    for (const output of outputs) {
      const target = `${output.final}.incoming`;
      await removeOwned(target);
      await mkdir(dirname(output.final), { recursive: true });
      await cp(output.stage, target, { recursive: true });
      incoming.push({ ...output, incoming: target });
    }
    for (const output of incoming) {
      const backup = `${output.final}.backup`;
      await removeOwned(backup);
      try {
        await renameFn(output.final, backup);
        replaced.push({ ...output, backup, hadOriginal: true });
      } catch (error) {
        if (!(error && typeof error === "object" && error.code === "ENOENT")) throw error;
        replaced.push({ ...output, backup, hadOriginal: false });
      }
      await renameFn(output.incoming, output.final);
    }
  } catch (error) {
    for (const output of [...replaced].reverse()) {
      await removeOwned(output.final);
      if (output.hadOriginal) await renameFn(output.backup, output.final);
    }
    throw error;
  } finally {
    await Promise.all(
      incoming.map(({ incoming: target }) => removeOwned(target)),
    );
  }
  await Promise.all(
    replaced.filter(({ hadOriginal }) => hadOriginal).map(({ backup }) => removeOwned(backup)),
  );
}
