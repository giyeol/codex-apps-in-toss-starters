import { lstat, readFile, readdir } from "node:fs/promises";
import { basename, extname, join, relative } from "node:path";

const IGNORED = new Set([".git", "node_modules", "dist", "coverage"]);
const FORBIDDEN_EXTENSIONS = new Set([
  ".pem",
  ".key",
  ".p12",
  ".p8",
  ".cer",
  ".crt",
  ".pfx",
  ".jks",
  ".mobileprovision",
]);
const TEXT_RISKS = [
  /BEGIN (?:RSA|OPENSSH|EC)? ?PRIVATE KEY/,
  /\b(?!hello@groundcode\.io\b)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\/(?:Users|home)\/[^/\s]+(?:\/|\b)/,
  /\b(?:01[016789])-?\d{3,4}-?\d{4}\b/,
  /https?:\/\/[^\s/@]+@/i,
  /(?:^|[,{]\s*)["']?(?:_authToken|authToken|token)["']?\s*(?::|=)\s*\S+/im,
  /registry:\s*https?:\/\/(?!registry\.npmjs\.org(?:[/:]|$))/i,
  /(?:adGroupId:\s*["'](?!ait-ad-test-interstitial-id["'])|TEST_AD_GROUP_ID\s*=\s*["'](?!ait-ad-test-interstitial-id["']))/,
];

export function isExcluded(relativePath) {
  return relativePath.startsWith("docs/superpowers/");
}

export function forbiddenFileReason(relativePath) {
  const name = basename(relativePath);
  const normalizedName = name.toLowerCase();
  if (name === ".env" || name.startsWith(".env.")) return "environment file";
  if (name === ".dev.vars" || name.startsWith(".dev.vars."))
    return "environment file";
  if (FORBIDDEN_EXTENSIONS.has(extname(name).toLowerCase()))
    return "secret file";
  if (
    normalizedName === "key.properties" ||
    normalizedName === "google-services.json" ||
    normalizedName === "googleservice-info.plist"
  )
    return "secret file";
  if (normalizedName.includes("contract") || name.includes("계약서"))
    return "contract file";
  return null;
}

export async function publicSafetyFindings(root) {
  const findings = [];
  for (const file of await listFiles(root)) {
    const name = relative(root, file);
    if ((await lstat(file)).isSymbolicLink()) {
      findings.push(`${name}: symbolic link`);
      continue;
    }
    if (isExcluded(name)) continue;
    const fileReason = forbiddenFileReason(name);
    if (fileReason) findings.push(`${name}: ${fileReason}`);
    if (!isText(file)) continue;
    const source = await readFile(file, "utf8");
    for (const pattern of TEXT_RISKS)
      if (pattern.test(source))
        findings.push(`${name}: forbidden source pattern`);
  }
  return findings;
}

export async function assertPublicSafe(root) {
  const findings = await publicSafetyFindings(root);
  if (findings.length)
    throw new Error(`Public safety scan failed:\n${findings.join("\n")}`);
}

function isText(file) {
  return !FORBIDDEN_EXTENSIONS.has(extname(file).toLowerCase());
}
async function listFiles(root) {
  const output = [];
  for (const name of (await readdir(root)).sort()) {
    if (IGNORED.has(name)) continue;
    const file = join(root, name);
    const info = await lstat(file);
    if (info.isSymbolicLink()) {
      output.push(file);
      continue;
    }
    if (info.isDirectory()) output.push(...(await listFiles(file)));
    else output.push(file);
  }
  return output;
}
