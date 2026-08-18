import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 2,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3003",
    trace: "off",
    video: "off",
  },
  webServer: {
    command: "npm run dev -- -p 3003",
    url: "http://localhost:3003",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
