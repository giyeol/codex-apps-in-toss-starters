const tossOrigin = /^https:\/\/[a-z0-9-]+\.(?:private-web|web)\.tossmini\.com$/;

export function allowedOrigin(origin: string | undefined): string | null {
  if (!origin) return null;
  try {
    const parsed = new URL(origin);
    if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash || parsed.origin !== origin) return null;
    if ((parsed.protocol === "http:" && (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")) || tossOrigin.test(origin)) return origin;
  } catch { /* invalid origins are rejected */ }
  return null;
}

export function corsHeaders(origin: string): HeadersInit {
  return { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "600" };
}
