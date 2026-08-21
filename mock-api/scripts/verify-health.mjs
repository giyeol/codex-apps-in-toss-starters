function normalizedDeploymentUrl(value) {
  if (!value) throw new Error("deployment-url output is required");
  let url;
  try { url = new URL(value); } catch { throw new Error("deployment-url must be a valid HTTPS URL"); }
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash)
    throw new Error("deployment-url must be a credential-free HTTPS origin");
  return url.origin;
}

export async function verifyHealth({ deploymentUrl, commitSha, fetcher = fetch, now = () => new Date() }) {
  const base = normalizedDeploymentUrl(deploymentUrl);
  if (!commitSha) throw new Error("commit SHA is required");
  const healthUrl = `${base}/health`;
  const response = await fetcher(healthUrl);
  let body;
  try { body = await response.json(); } catch { throw new Error("health response must be JSON"); }
  if (!response.ok || body?.ok !== true) throw new Error("health check did not return {ok:true}");
  return { commitSha, deploymentUrl: base, healthUrl, giftsUrl: `${base}/v1/gifts`, verifiedAt: now().toISOString() };
}

if (import.meta.main) {
  const receipt = await verifyHealth({ deploymentUrl: process.env.DEPLOYMENT_URL, commitSha: process.env.GITHUB_SHA });
  process.stdout.write(`${JSON.stringify(receipt)}\n`);
}
