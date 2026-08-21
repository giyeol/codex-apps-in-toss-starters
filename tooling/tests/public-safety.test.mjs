import assert from "node:assert/strict";
import { mkdir, mkdtemp, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  assertPublicSafe,
  forbiddenFileReason,
} from "../scripts/lib/public-safety.mjs";

test("scans lockfiles but permits normal registry and integrity metadata", async () => {
  const fixture = await mkdtemp(join(tmpdir(), "public-safety-lockfile-"));
  await writeFile(join(fixture, "pnpm-lock.yaml"), "registry: https://registry.npmjs.org/\nintegrity: sha512-safe\n");
  await assert.doesNotReject(() => assertPublicSafe(fixture));
  await writeFile(join(fixture, "pnpm-lock.yaml"), "resolution: https://token" + "@example.test/pkg\n");
  await assert.rejects(() => assertPublicSafe(fixture), /forbidden source pattern/);
});

test("rejects personal contact, absolute paths, and credential URLs", async () => {
  const fixture = await mkdtemp(join(tmpdir(), "public-safety-contact-"));
  for (const source of ["person" + "@gmail.com", "/Us" + "ers/someone/private", "/ho" + "me/someone/private", "010-" + "1234-5678", "https://user" + ":pass" + "word" + "@example.test"]) {
    await writeFile(join(fixture, "public.txt"), source);
    await assert.rejects(() => assertPublicSafe(fixture), /forbidden source pattern/);
  }
  await writeFile(join(fixture, "public.txt"), "hello@groundcode.io");
  await assert.doesNotReject(() => assertPublicSafe(fixture));
});

test("rejects every personal email TLD except the public contact address", async () => {
  const fixture = await mkdtemp(join(tmpdir(), "public-safety-email-"));
  for (const source of ["person" + "@example.io", "person" + "@example.dev"]) {
    await writeFile(join(fixture, "public.txt"), source);
    await assert.rejects(() => assertPublicSafe(fixture), /forbidden source pattern/);
  }
  await writeFile(join(fixture, "public.txt"), "hello" + "@groundcode.io");
  await assert.doesNotReject(() => assertPublicSafe(fixture));
});

test("rejects colon and equals token values plus registry suffix attacks", async () => {
  const fixture = await mkdtemp(join(tmpdir(), "public-safety-token-"));
  for (const source of ["to" + "ken: secret-value", "to" + "ken = secret-value", "reg" + "istry: https://registry.npmjs.org" + ".evil.test/"]) {
    await writeFile(join(fixture, "public.yaml"), source);
    await assert.rejects(() => assertPublicSafe(fixture), /forbidden source pattern/);
  }
});

test("rejects harmlessly named secret and contract fixtures", async () => {
  const fixture = await mkdtemp(join(tmpdir(), "public-safety-"));
  await writeFile(join(fixture, ".env.local"), "SAFE_FIXTURE=value\n");
  await assert.rejects(() => assertPublicSafe(fixture), /environment file/);
  assert.equal(forbiddenFileReason("certificate.pem"), "secret file");
  assert.equal(forbiddenFileReason("contract-draft.txt"), "contract file");
  assert.equal(forbiddenFileReason("key.properties"), "secret file");
  assert.equal(forbiddenFileReason("google-services.json"), "secret file");
  assert.equal(forbiddenFileReason("GoogleService-Info.plist"), "secret file");
  assert.equal(forbiddenFileReason("certificate.cer"), "secret file");
  assert.equal(forbiddenFileReason("certificate.crt"), "secret file");
  assert.equal(forbiddenFileReason("certificate.pfx"), "secret file");
  assert.equal(forbiddenFileReason("client-계약서-draft.md"), "contract file");
});

test("rejects symlinks without reading their target", async () => {
  const fixture = await mkdtemp(join(tmpdir(), "public-safety-symlink-"));
  await symlink("/etc/hosts", join(fixture, "outside-link"));
  await assert.rejects(() => assertPublicSafe(fixture), /symbolic link/);
});

test("rejects private keys, unsafe ad IDs, and excluded-tree symlinks", async () => {
  const fixture = await mkdtemp(join(tmpdir(), "public-safety-patterns-"));
  await writeFile(join(fixture, "key.txt"), ["-----BEGIN", " PRIVATE KEY-----"].join(""));
  await assert.rejects(() => assertPublicSafe(fixture), /forbidden source pattern/);
  await writeFile(join(fixture, "key.txt"), ["const TEST_AD_GROUP_ID", " = 'real-id';"].join(""));
  await assert.rejects(() => assertPublicSafe(fixture), /forbidden source pattern/);
  await mkdir(join(fixture, "docs", "superpowers"), { recursive: true });
  await symlink("/etc/hosts", join(fixture, "docs", "superpowers", "link"));
  await assert.rejects(() => assertPublicSafe(fixture), /docs\/superpowers\/link: symbolic link/);
});
