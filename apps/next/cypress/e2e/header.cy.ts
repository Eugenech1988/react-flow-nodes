describe('Header', () => {
  it('renders exactly one header on nested routes', () => {
    cy.visit('/en/careers');
    cy.get('header').should('have.length', 1);
    cy.visit('/en/blog');
    cy.get('header').should('have.length', 1);
  });

  it('renders logo and brand', () => {
    cy.visit('/en');
    cy.get('header').within(() => {
      cy.contains('pipeline studio', { matchCase: false }).should('be.visible');
    });
  });

  it('toggles mobile menu', () => {
    cy.setMobileViewport();
    cy.visit('/en');
    cy.get('#mobile-menu').should('not.be.visible');
    cy.get('header').find('button[aria-label*="menu"]').click();
    cy.get('#mobile-menu').should('be.visible');
    cy.get('header').find('button[aria-label*="menu"]').click();
    cy.get('#mobile-menu').should('not.be.visible');
  });

  it('closes mobile menu on nav click', () => {
    cy.setMobileViewport();
    cy.visit('/en');
    cy.get('header').find('button[aria-label*="menu"]').click();
    cy.get('#mobile-menu').within(() => {
      cy.contains(/About|Про нас/i).click();
    });
    cy.location('pathname').should('eq', '/en/about');
    cy.get('#mobile-menu').should('not.be.visible');
  });

  it('opens nav link without double slash', () => {
    cy.setDesktopViewport();
    cy.visit('/en');
    cy.get('header nav').contains(/About|Про нас/i).should('have.attr', 'href', '/en/about');
  });
});
