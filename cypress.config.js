const { defineConfig } = require("cypress");

CYPRESS_BASE_URL= "http:localhost:8080"

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
