import { defineConfig } from "@apps-in-toss/web-framework/config";
import service from "./service.config.json";
export default defineConfig({
  appName: service.appName,
  brand: { primaryColor: service.primaryColor },
  permissions: [],
  webBundleDir: "dist",
});
