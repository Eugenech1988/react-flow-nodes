describe('Localization routing', () => {
  it('redirects /ua to /uk with 301', () => {
    cy.request({ url: '/ua', followRedirect: false }).then((res) => {
      expect(res.status).to.eq(301);
      expect(res.headers.location).to.match(/\/uk$/);
    });
  });

  it('redirects /ua/careers to /uk/careers', () => {
    cy.request({ url: '/ua/careers', followRedirect: false }).then((res) => {
      expect(res.status).to.eq(301);
      expect(res.headers.location).to.match(/\/uk\/careers$/);
    });
  });

  it('redirects /ua/blog/some-slug to /uk/blog/some-slug', () => {
    cy.request({ url: '/ua/blog/some-slug', followRedirect: false }).then((res) => {
      expect(res.status).to.eq(301);
      expect(res.headers.location).to.match(/\/uk\/blog\/some-slug$/);
    });
  });

  it('serves sitemap.xml with /en and /uk, no /ua', () => {
    cy.request('/sitemap.xml').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include('/en');
      expect(res.body).to.include('/uk');
      expect(res.body).not.to.include('/ua');
    });
  });
});
