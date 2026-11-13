describe('Hero canvas', () => {
  it('renders nodes without crash', () => {
    cy.setDesktopViewport();
    cy.visit('/en');
    cy.contains('CORE.INGEST', { timeout: 8000 }).should('be.visible');
    cy.contains('NEURAL.ENGINE').should('be.visible');
    cy.contains('SHIELD.SECURE').should('be.visible');
  });

  it('does not throw errors on mount', () => {
    const errors: string[] = [];
    cy.on('uncaught:exception', (err) => {
      errors.push(err.message);
      return false;
    });
    cy.setDesktopViewport();
    cy.visit('/en');
    cy.contains('CORE.INGEST');
    cy.then(() => {
      expect(errors.filter((e) => e.includes("reading 'x'"))).to.have.length(0);
    });
  });
});
