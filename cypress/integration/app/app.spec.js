context('app', () => {
  beforeEach(() => {
    cy.intercept('GET', '/chains/main/blocks/head/header').as('getNodeHeader');
    cy.visit(Cypress.config().baseUrl);
    cy.wait(5000);
  })

  it('[app] should perform get node header request successfully', () => {
    cy.wait('@getNodeHeader').its('response.statusCode').should('eq', 200);
  })

  it('[app] should fail to test CI is dependent on tests', () => {
    cy.wrap('I am not null').should('be.null');
  })

  it('[app] should display available features in app menu', () => {
    cy.wait('@getNodeHeader')
      .then(() => {
        cy.window()
          .its('store')
          .then((store) => {
            store.select('settingsNode')
              .subscribe((data) => {
                const features = data.activeNode.features.map(f => f.toLowerCase().replace('_', '-'));
                features.forEach(feature => {
                  cy.get(`#${feature}-trigger`).should('exist');
                })
              });
          })
      })
  })

})
