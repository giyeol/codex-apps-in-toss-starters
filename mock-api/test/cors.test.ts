import { describe, expect, it } from "vitest";
import { allowedOrigin } from "../src/cors";

describe("CORS origins", () => {
  it("accepts only local development and exact HTTPS Toss origins", () => {
    expect(allowedOrigin("http://localhost:5173")).toBe("http://localhost:5173");
    expect(allowedOrigin("http://127.0.0.1")).toBe("http://127.0.0.1");
    expect(allowedOrigin("https://course-gift-finder.private-web.tossmini.com")).toBe("https://course-gift-finder.private-web.tossmini.com");
    expect(allowedOrigin("https://course-gift-finder.web.tossmini.com")).toBe("https://course-gift-finder.web.tossmini.com");
  });

  it("rejects credentials, suffix attacks, and non-HTTPS Toss origins", () => {
    for (const origin of ["https://user" + "@course-gift-finder.web.tossmini.com", "https://course-gift-finder.web.tossmini.com.evil.test", "http://course-gift-finder.web.tossmini.com"]) expect(allowedOrigin(origin)).toBeNull();
  });
});
