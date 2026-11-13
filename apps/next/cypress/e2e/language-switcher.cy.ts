describe('Language switcher', () => {
  beforeEach(() => {
    cy.setDesktopViewport();
  });

  it('switches EN -> UK in path', () => {
    cy.visit('/en');
    cy.get('header').find('button').contains('UA').click();
    cy.location('pathname').should('eq', '/uk');
  });

  it('switches UK -> EN in path', () => {
    cy.visit('/uk');
    cy.get('header').find('button').contains('EN').click();
    cy.location('pathname').should('eq', '/en');
  });

  it('preserves path after switching', () => {
    cy.visit('/en/blog');
    cy.get('header').find('button').contains('UA').click();
    cy.location('pathname').should('eq', '/uk/blog');
  });

  it('does not navigate when clicking active locale', () => {
    cy.visit('/en/blog');
    cy.get('header').find('button').contains('EN').click();
    cy.location('pathname').should('eq', '/en/blog');
  });
});
