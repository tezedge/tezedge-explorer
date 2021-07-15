context('APP', () => {
  beforeEach(() => {
    cy.intercept('GET', '/chains/main/blocks/head/header').as('getNodeHeader');
    cy.visit(Cypress.config().baseUrl);
  });

  it('[APP] should perform get node header request successfully', () => {
    cy.wait(1000).then(() => {
      cy.wait('@getNodeHeader').its('response.statusCode').should('eq', 200);
    });
  });

  it('[APP] should display available features in app menu', () => {
    cy.wait(1000).then(() => {
      cy.wait('@getNodeHeader').then(() => {
        cy.window()
          .its('store')
          .then((store) => {
            store.select('settingsNode').subscribe(nodeSettings => {
              const possibleMenus = ['monitoring', 'mempool', 'resources', 'network', 'logs'];
              if (nodeSettings.activeNode.type !== 'octez') {
                possibleMenus.push('storage');
              }
              cy.wait(1000).then(() => {
                possibleMenus.forEach(menu => {
                  if (nodeSettings.activeNode.features.some(f => f.name.includes(menu))) {
                    cy.get(`#${menu}-trigger`).should('be.visible');
                  }
                });
              });
            });
          });
      });
    });
  });

});
