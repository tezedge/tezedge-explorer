context('SETTINGS NODE', () => {
  beforeEach(() => {
    cy.intercept('GET', '/chains/main/blocks/head/header').as('getNodeHeader');
    cy.visit(Cypress.config().baseUrl);
    cy.wait(3000);
  });

  it('[SETTINGS NODE] should perform get node header request successfully', () => {
    cy.wait('@getNodeHeader').its('response.statusCode').should('eq', 200);
  });

  it('[SETTINGS NODE] should change backend node using the switcher', () => {
    cy.wait('@getNodeHeader')
      .then(() => {
        let initialActiveNodeId;
        cy.window()
          .its('store')
          .then((store) => {
            store.select('settingsNode')
              .subscribe((settingsNode) => {
                if (Object.keys(settingsNode.entities).length <= 1
                  || settingsNode.activeNode.id === settingsNode.entities[settingsNode.ids[1]].id) {
                  // quit if there is only one node available
                  return;
                }
                initialActiveNodeId = settingsNode.activeNode.id;
                cy.get('.settings-node-select').click();
                cy.wait(1000);
                cy.get('.settings-node-option').last().click();
                cy.wait(1000);
              });
            cy.wait(3000).then(() => {
              store.select('settingsNode')
                .subscribe((settingsNode) => {
                  expect(settingsNode.activeNode.id).to.not.equal(initialActiveNodeId);
                });
            });
          });
      });
  });

  it('[SETTINGS NODE] should get features successfully', () => {
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

  it('[SETTINGS NODE] should update ocaml synchronization every second', () => {
    cy.intercept('GET', '/network/peers').as('peers');
    cy.wait('@getNodeHeader')
      .then(() => {
        cy.window()
          .its('store')
          .then((store) => {
            let isNodeSwitchingAvailable = false;

            store.select('settingsNode')
              .subscribe((settingsNode) => {

                isNodeSwitchingAvailable = (settingsNode.ids.some(id => id.includes('ocaml'))
                  && settingsNode.ids.length > 1
                  && !settingsNode.entities[settingsNode.ids[0]].id.includes('ocaml'));
                if (!isNodeSwitchingAvailable) {
                  // quit if ocaml is absent
                  return;
                }

                if (!settingsNode.activeNode.id.includes('ocaml')) {
                  cy.get('.settings-node-select').click();
                  cy.wait(1000);
                  cy.get('.settings-node-option').last().click();
                  cy.wait(2000);
                }
              });
            cy.wait(4000).then(() => {
              store.select('settingsNode')
                .subscribe(() => {
                  if (isNodeSwitchingAvailable) {
                    cy.wait('@peers');
                    cy.get('@peers.all').should('have.length', 6);
                  }
                });
            });
          });
      });
  });

  it('[SETTINGS NODE] should update ocaml synchronization every 5 seconds on a different page', () => {
    cy.intercept('GET', '/network/peers').as('peers');

    cy.wait('@getNodeHeader')
      .then(() => {
        cy.window()
          .its('store')
          .then((store) => {
            let isNodeSwitchingAvailable = false;

            store.select('settingsNode')
              .subscribe((settingsNode) => {

                isNodeSwitchingAvailable = (settingsNode.ids.some(id => id.includes('ocaml'))
                  && settingsNode.ids.length > 1
                  && !settingsNode.entities[settingsNode.ids[0]].id.includes('ocaml'));
                if (!isNodeSwitchingAvailable) {
                  // quit if ocaml is absent
                  return;
                }

                if (!settingsNode.activeNode.id.includes('ocaml')) {
                  cy.get('.settings-node-select').click();
                  cy.wait(1000);
                  cy.get('.settings-node-option').last().click();
                  cy.wait(2000);
                }
              });

            cy.wait(5000).then(() => {
              store.select('settingsNode')
                .subscribe(() => {
                  if (isNodeSwitchingAvailable) {
                    cy.visit(Cypress.config().baseUrl + '/#/resources/system', { timeout: 2000 });
                    cy.wait(8000);
                    cy.wait('@peers');
                    cy.get('@peers.all').should('have.length', 8);
                  }
                });
            });
          });
      });
  });

});
