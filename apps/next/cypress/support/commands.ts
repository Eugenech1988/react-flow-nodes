export {};

declare global {
  namespace Cypress {
    interface Chainable {
      visitHome(locale?: 'en' | 'uk'): Chainable<void>;
      visitBlog(locale?: 'en' | 'uk'): Chainable<void>;
      visitCareers(locale?: 'en' | 'uk'): Chainable<void>;
      setDesktopViewport(): Chainable<void>;
      setMobileViewport(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('visitHome', (locale = 'en') => {
  cy.visit(`/${locale}`);
  cy.contains('pipeline studio', { matchCase: false }).should('be.visible');
});

Cypress.Commands.add('visitBlog', (locale = 'en') => {
  cy.visit(`/${locale}/blog`);
  cy.contains(/Pipeline Journal|Журнал Pipeline/i).should('be.visible');
});

Cypress.Commands.add('visitCareers', (locale = 'en') => {
  cy.visit(`/${locale}/careers`);
  cy.contains(/Join the Workshop|Приєднуйтесь до майстерні/i).should('be.visible');
});

Cypress.Commands.add('setDesktopViewport', () => {
  cy.viewport(1440, 900);
});

Cypress.Commands.add('setMobileViewport', () => {
  cy.viewport('iphone-x');
});
