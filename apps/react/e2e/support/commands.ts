interface IMockUser {
  id: string;
  email: string;
  role: 'USER' | 'CONTENT_MANAGER' | 'SUPER_ADMIN';
  currentPipelineId: string | null;
  subscription: { plan: string; planStatus: string } | null;
  isTwoFactorEnabled: boolean;
  profile: { firstName: string; lastName: string; avatarUrl: string | null } | null;
}

declare global {
  namespace Cypress {
    interface Chainable {
      mockAuth: (user: Partial<IMockUser> | null) => Chainable<void>;
      mockCsrf: () => Chainable<void>;
    }
  }
}

const defaultUser: IMockUser = {
  id: 'u1',
  email: 'e2e@test.local',
  role: 'USER',
  currentPipelineId: null,
  subscription: { plan: 'PRO', planStatus: 'ACTIVE' },
  isTwoFactorEnabled: false,
  profile: { firstName: 'E2E', lastName: 'User', avatarUrl: null },
};

Cypress.Commands.add('mockCsrf', () => {
  cy.intercept('GET', '**/csrf-token*', {
    statusCode: 200,
    body: { csrfToken: 'mock-csrf' },
  }).as('csrf');
});

Cypress.Commands.add('mockAuth', (user: Partial<IMockUser> | null) => {
  const payload = user === null ? null : { ...defaultUser, ...user };

  cy.intercept('GET', '**/trpc/auth.me*', (req) => {
    req.reply({
      statusCode: 200,
      body: [{ result: { data: payload } }],
    });
  }).as('authMe');
});

export {};
