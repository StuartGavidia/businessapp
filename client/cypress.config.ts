import { defineConfig } from "cypress";
import codeCoverageTask from "@cypress/code-coverage/task";

const baseUrl = process.env.BASE_URL || 'http://localhost:5173';

export default defineConfig({
  env: {
    codeCoverage: {
      exclude: "cypress/**/*.*",
    },
  },
  e2e: {
    baseUrl: baseUrl,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      console.log(on, config)
    },
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);

      return config;
    },
  },
});