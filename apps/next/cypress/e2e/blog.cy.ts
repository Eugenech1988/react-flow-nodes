describe('Blog listing', () => {
  beforeEach(() => {
    cy.setDesktopViewport();
    cy.visitBlog('en');
  });

  it('renders hero and entries count', () => {
    cy.contains(/Pipeline Journal|Журнал Pipeline/i).should('be.visible');
    cy.contains(/ENTRIES|ЗАПИСІВ/i).should('be.visible');
  });

  it('renders cards with ENTRY ids', () => {
    cy.get('a[href*="/blog/"]').should('have.length.greaterThan', 0);
    cy.contains(/ENTRY\./i).should('be.visible');
  });

  it('filters by category', () => {
    cy.contains(/ENGINEERING/i)
      .first()
      .click();
    cy.url().should('include', '/blog');
    cy.get('a[href*="/blog/"]').should('have.length.greaterThan', 0);
  });

  it('filters by search', () => {
    cy.get('a[href*="/blog/"]')
      .last()
      .then(($card) => {
        const text = $card.text().trim();
        const keyword = text.split(/\s+/).find((w) => w.length > 3) || 'a';

        cy.get('input[placeholder*="SEARCH"]').type(keyword);
        cy.wait(300);

        cy.get('a[href*="/blog/"]').should('have.length.greaterThan', 0);
      });
  });

  it('shows empty state for no results', () => {
    cy.get('input[placeholder*="SEARCH"]').type('zzzzzzzzz');
    cy.wait(300);
    cy.contains(/NO ENTRIES|ЗАПИСІВ НЕМА/i).should('be.visible');
  });

  it('clears search', () => {
    cy.get('input[placeholder*="SEARCH"]').type('zzzzzzzzz');
    cy.wait(300);
    cy.get('[aria-label="Clear search"]').click();
    cy.contains(/ENTRY\./i).should('be.visible');
  });

  it('opens a blog post', () => {
    cy.get('a[href*="/blog/"]').first().click();
    cy.url().should('match', /\/en\/blog\/[^/]+$/);
    cy.contains(/Return to Archive|Повернутися до архіву/i).should('be.visible');
  });

  it('submits subscribe form without reload', () => {
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('button[type="submit"]')
      .contains(/SUBSCRIBE|ПІДПИСАТИСЬ/i)
      .click();
    cy.url().should('not.include', '?');
    cy.get('input[type="email"]').should('have.value', '');
  });
});
