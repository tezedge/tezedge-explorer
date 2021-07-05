context('APP', () => {
  beforeEach(() => {
    cy.intercept('GET', '/chains/main/blocks/head/header').as('getNodeHeader');
    cy.visit(Cypress.config().baseUrl);
    cy.wait(5000);
  });

  it('[APP] should perform get node header request successfully', () => {
    cy.wait('@getNodeHeader').its('response.statusCode').should('eq', 200);
  });

  it('[APP] should display available features in app menu', () => {
    cy.wait('@getNodeHeader')
      .then(() => {
        cy.window()
          .its('store')
          .then((store) => {
            store.select('settingsNode')
              .subscribe((data) => {
                const possibleMenus = ['monitoring', 'mempool', 'storage', 'resources', 'network', 'logs'];

                possibleMenus.forEach(menu => {
                  if (data.activeNode.features.some(f => f.name.includes(menu))) {
                    cy.get(`#${menu}-trigger`).should('exist');
                  }
                });
              });
          });
      });
  });

});
