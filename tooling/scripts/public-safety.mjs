import { resolve } from "node:path";
import { assertPublicSafe } from "./lib/public-safety.mjs";

await assertPublicSafe(resolve(process.argv[2] ?? "."));
console.log("Public safety scan passed.");
