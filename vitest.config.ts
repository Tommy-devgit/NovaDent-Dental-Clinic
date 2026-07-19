import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/generated/**", "e2e/**"],
    coverage: {
      provider: "v8",
      include: ["packages/*/src/**", "packages/utils/**", "packages/validations/**", "apps/*/app/api/**", "apps/*/lib/**"],
      exclude: ["**/*.test.ts", "**/generated/**"],
    },
  },
});
