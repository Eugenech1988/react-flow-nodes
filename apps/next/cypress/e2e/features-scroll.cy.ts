describe('Features section scroll', () => {
  beforeEach(() => {
    cy.setDesktopViewport();
    cy.visit('/en');
    cy.get('#features').scrollIntoView();
  });

  it('renders section with correct height on desktop', () => {
    cy.get('#features').should(($el) => {
      const height = $el[0].getBoundingClientRect().height;
      expect(height).to.be.greaterThan(window.innerHeight * 2);
    });
  });

  it('changes active step on scroll', () => {
    cy.get('[aria-current="step"]').should('contain', '01');

    cy.get('#features').then(($el) => {
      const offsetTop = $el[0].offsetTop;
      cy.scrollTo(0, offsetTop + 1500, { duration: 300 });
    });

    cy.wait(500);
    cy.get('[aria-current="step"]').invoke('text').should('not.eq', '01');
  });

  it('changes active step on step click', () => {
    cy.get('button[aria-label*="Go to step"]').eq(3).click();
    cy.wait(1000);
    cy.get('[aria-current="step"]').should('contain', '04');
  });

  it('stays sticky during scroll', () => {
    cy.scrollTo(0, 1200);
    cy.get('#features > div').should('have.css', 'position', 'sticky');
  });
});
