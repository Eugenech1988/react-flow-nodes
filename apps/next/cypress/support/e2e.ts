import './commands';

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver loop')) return false;
  return !err.message.includes('Hydration');

});
