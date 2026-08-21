import { readFile } from "node:fs/promises";
import { validateServiceConfig } from "./lib/service-config.mjs";
const config = JSON.parse(await readFile("service.config.json", "utf8"));
const errors = validateServiceConfig(config);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
}
if (!config.configuredForQr) {
  const message = "QR 테스트 전에 pnpm setup을 실행해 주세요.";
  if (process.argv.includes("--qr")) {
    console.error(message);
    process.exitCode = 1;
  } else console.warn("[WARN] " + message);
}
