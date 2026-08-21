import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import net from "node:net";
import { validateServiceConfig } from "./lib/service-config.mjs";

let failed = false;
function row(level, message) {
  console.log(`[${level}] ${message}`);
  if (level === "FAIL") failed = true;
}
function portInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(true));
    server.once("listening", () => server.close(() => resolve(false)));
    server.listen(port, "127.0.0.1");
  });
}

const [major, minor] = process.versions.node.split(".").map(Number);
const supportedNode = major === 24 && (minor ?? 0) >= 8;
row(supportedNode ? "PASS" : "FAIL", "Node.js 24.8.0 이상, 25 미만");
row(
  process.env.npm_execpath?.includes("pnpm") ? "PASS" : "WARN",
  "pnpm으로 실행",
);
for (const file of [
  "package.json",
  "apps-in-toss.config.ts",
  "vite.config.ts",
  "src/main.tsx",
]) {
  row(
    existsSync(file) ? "PASS" : "FAIL",
    `${file} ${existsSync(file) ? "존재" : "없음"}`,
  );
}
let config = null;
try {
  config = JSON.parse(await readFile("service.config.json", "utf8"));
  const errors = validateServiceConfig(config);
  row(
    errors.length === 0 ? "PASS" : "FAIL",
    errors.length === 0
      ? "service.config.json 형식"
      : `service.config.json: ${errors.join(" ")}`,
  );
} catch (error) {
  row(
    "FAIL",
    `service.config.json을 읽을 수 없음: ${error instanceof Error ? error.message : String(error)}`,
  );
}
row(
  config?.configuredForQr === true ? "PASS" : "WARN",
  config?.configuredForQr === true
    ? "QR용 appName 설정됨"
    : "QR 설정 전: 콘솔 appName을 만든 뒤 pnpm setup을 실행하세요.",
);
const occupied = await portInUse(5173);
row(
  occupied ? "WARN" : "PASS",
  occupied
    ? "5173 포트 사용 중: pnpm dev 종료 또는 다른 포트를 사용하세요."
    : "5173 포트 사용 가능",
);
if (failed) process.exitCode = 1;
