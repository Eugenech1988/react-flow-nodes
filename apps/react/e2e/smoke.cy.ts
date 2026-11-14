describe('smoke — unauthenticated', () => {
  beforeEach(() => {
    cy.mockCsrf();
    cy.mockAuth(null);
  });

  it('root redirects to /login when not authenticated', () => {
    cy.visit('/');
    cy.location('pathname').should('eq', '/login');
  });

  it('/login renders welcome heading', () => {
    cy.visit('/login');
    cy.contains('h2', /Welcome to the Pipeline Studio/i).should('be.visible');
  });

  it('/login renders email and password inputs', () => {
    cy.visit('/login');
    cy.get('form input[type="text"]').should('have.length.at.least', 1);
    cy.get('form input[type="password"]').should('have.length.at.least', 1);
  });

  it('/login submit button is visible', () => {
    cy.visit('/login');
    cy.contains('button', /Authenticate Access/i).should('be.visible');
  });

  it('shows validation on empty login submit', () => {
    cy.visit('/login');
    cy.contains('button', /Authenticate Access/i).click();
    cy.get('form').should('exist');
    cy.contains(/required|invalid|email/i).should('exist');
  });
});

describe('smoke — authenticated USER', () => {
  beforeEach(() => {
    cy.mockCsrf();
    cy.mockAuth({ role: 'USER' });
  });

  it('/login redirects to / for authenticated USER', () => {
    cy.visit('/login');
    cy.location('pathname').should('eq', '/');
  });

  it('USER visiting /admin/jobs is redirected', () => {
    cy.visit('/admin/jobs');
    cy.location('pathname').should('eq', '/');
  });
});

describe('smoke — authenticated CONTENT_MANAGER', () => {
  beforeEach(() => {
    cy.mockCsrf();
    cy.mockAuth({ role: 'CONTENT_MANAGER' });
  });

  it('CONTENT_MANAGER visiting /admin/jobs sees the page', () => {
    cy.visit('/admin/jobs');
    cy.location('pathname').should('include', '/admin/jobs');
    cy.contains(/Job Vacancies/i).should('be.visible');
  });

  it('CONTENT_MANAGER visiting /login is redirected to /admin/jobs', () => {
    cy.visit('/login');
    cy.location('pathname').should('eq', '/admin/jobs');
  });
});

describe('smoke — 404', () => {
  beforeEach(() => {
    cy.mockCsrf();
    cy.mockAuth({ role: 'USER' });
  });

  it('unknown path shows NotFoundPage', () => {
    cy.visit('/this-path-does-not-exist-xyz', { failOnStatusCode: false });
    cy.contains(/404/).should('be.visible');
    cy.contains(/Page not found/i).should('be.visible');
  });
});
