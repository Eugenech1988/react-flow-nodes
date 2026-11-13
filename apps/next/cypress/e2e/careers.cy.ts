describe('Careers listing', () => {
  beforeEach(() => {
    cy.setDesktopViewport();
    cy.visitCareers('en');
  });

  it('renders hero, stats and openings frame', () => {
    cy.contains(/Join the Workshop/i).should('be.visible');
    cy.get('[role="img"][aria-label="42"]').should('exist');
    cy.get('[role="meter"]').should('exist');
  });

  it('filters by department', () => {
    cy.get('button:visible').contains(/Engineering/i).click();
    cy.url().should('include', '/careers');
  });

  it('filters on mobile via dropdown', () => {
    cy.setMobileViewport();
    cy.visitCareers('en');
    cy.get('[aria-expanded="false"]').contains(/All/i).click();
    cy.get('[aria-expanded="true"]').should('exist');
  });

  it('opens job detail', () => {
    cy.get('a[href*="/careers/"]').first().click();
    cy.url().should('match', /\/careers\/[^/]+$/);
    cy.contains(/Return to Openings|Повернутися до вакансій/i).should('be.visible');
  });

  it('shows application form on job detail', () => {
    cy.get('a[href*="/careers/"]').first().click();
    cy.get('#apply-form').should('exist');
    cy.contains(/Submit Application|Надіслати заявку/i).should('be.visible');
  });
});
