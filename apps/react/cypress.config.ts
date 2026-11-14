import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5174',
    specPattern: 'e2e/**/*.cy.ts',
    supportFile: 'e2e/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    retries: { runMode: 0, openMode: 0 },
    defaultCommandTimeout: 8000,
    requestTimeout: 10000,
  },
});
