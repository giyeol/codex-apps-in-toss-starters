import { readFile, rename, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { canApplySetup, validateServiceConfig } from "./lib/service-config.mjs";

const configPath = "service.config.json";
const current = JSON.parse(await readFile(configPath, "utf8"));
const rl = createInterface({ input: stdin, output: stdout });

try {
  const ask = async (key, label) =>
    (await rl.question(`${label} (${current[key]}): `)).trim() || current[key];
  const appName = (await ask("appName", "콘솔 appName")).trim();
  if (
    !canApplySetup({
      candidateAppName: appName,
      currentAppName: current.appName,
      configuredForQr: current.configuredForQr,
    })
  ) {
    throw new Error(
      "처음에는 예시 course-* 대신 콘솔 appName을 입력해 주세요. 설정 후에는 같은 appName으로만 표시명과 색상을 바꿀 수 있어요.",
    );
  }
  const next = {
    ...current,
    appName,
    displayName: (await ask("displayName", "화면 표시명")).trim(),
    primaryColor: (await ask("primaryColor", "대표 색상")).trim().toUpperCase(),
    configuredForQr: true,
  };
  const errors = validateServiceConfig(next);
  if (errors.length > 0) throw new Error(errors.join("\n"));
  await writeFile(`${configPath}.tmp`, `${JSON.stringify(next, null, 2)}\n`);
  await rename(`${configPath}.tmp`, configPath);
  console.log("service.config.json을 설정했어요.");
} finally {
  rl.close();
}
