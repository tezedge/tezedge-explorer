context('settingsNode', () => {
  beforeEach(() => {
    cy.intercept('GET', '/chains/main/blocks/head/header').as('getNodeHeader');
    cy.visit(Cypress.config().baseUrl);
    cy.wait(5000);
  });

  it('[settingsNode] should perform get node header request successfully', () => {
    cy.wait('@getNodeHeader').its('response.statusCode').should('eq', 200);
  });

  it('[settingsNode] should get features successfully', () => {
    cy.wait('@getNodeHeader')
      .then(() => {
        cy.window()
          .its('store')
          .then((store) => {
            store.select('settingsNode')
              .subscribe((settingsNode) => {
                const featuresArrayIsNotEmpty = settingsNode.activeNode.features.length > 0;
                cy.wrap(featuresArrayIsNotEmpty).should('eq', true);
              });
          });
      });
  });

  it('[settingsNode] should change backend node using the switcher', () => {
    cy.wait('@getNodeHeader')
      .then(() => {
        cy.window()
          .its('store')
          .then((store) => {
            let initialActiveNodeId;
            let nodeChanged = false;
            store.select('settingsNode')
              .subscribe((settingsNode) => {
                if (settingsNode.ids.every(id => settingsNode.entities[id].header)) {
                  // quit if there is only one node available
                  return;
                }
                if (!nodeChanged) {
                  initialActiveNodeId = settingsNode.activeNode.id;
                  nodeChanged = true;
                  cy.get('.settings-node-select').click();
                  cy.get('.settings-node-option').last().click();
                } else {
                  expect(settingsNode.activeNode.id).to.not.equal(initialActiveNodeId);
                }
              });
          });
      });
  });

});
