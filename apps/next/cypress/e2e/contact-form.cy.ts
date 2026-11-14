describe('Inquiry form on /contacts', () => {
  beforeEach(() => {
    cy.setDesktopViewport();
    cy.visit('/en/contacts');
  });

  it('shows validation errors on empty submit', () => {
    cy.contains('button', /Send Message|Transmit/i).click();
    cy.contains(/Name must be at least/i).should('be.visible');
    cy.contains(/valid email/i).should('be.visible');
  });

  it('fills and clicks submit without errors', () => {
    const errors: string[] = [];
    cy.on('uncaught:exception', (err) => {
      errors.push(err.message);
      return false;
    });

    cy.contains('label', /Operator Name/i)
      .next()
      .type('John Doe');
    cy.contains('label', /Comm-Link/i)
      .next()
      .type('john@example.com');
    cy.contains('label', /Organization/i)
      .next()
      .type('Acme');
    cy.contains('label', /Position/i)
      .next()
      .type('Dev');
    cy.contains('label', /Mission Parameters/i)
      .next()
      .type('Test message 12345');

    cy.contains('button', /Send Message|Transmit/i).click();

    cy.then(() => {
      expect(errors.filter((e) => e.includes('Uncaught'))).to.have.length(0);
    });
  });
});
