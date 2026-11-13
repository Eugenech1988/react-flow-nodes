import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4321',
    viewportWidth: 1440,
    viewportHeight: 900,
    video: false,
    screenshotOnRunFailure: true,
    retries: { runMode: 2, openMode: 0 },
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
