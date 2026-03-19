import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    exclude: [
      "./src/composables/api/types.test.ts",
      "./src/composables/api/crud-examples.test.ts",
      "node_modules",
    ],
  },
})
