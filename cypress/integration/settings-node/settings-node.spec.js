context('SETTINGS NODE', () => {
  beforeEach(() => {
    cy.intercept('GET', '/chains/main/blocks/head/header').as('getNodeHeader')
      .visit(Cypress.config().baseUrl, { timeout: 100000 })
      .wait('@getNodeHeader')
      .wait(1000);
  });

  it('[SETTINGS NODE] should change backend node using the switcher', () => {
    let initialActiveNodeId;
    cy.wait(3000)
      .window()
      .its('store')
      .then((store) => {
        store.select('settingsNode').subscribe(settingsNode => {
          if (Object.keys(settingsNode.entities).length <= 1
            || settingsNode.activeNode.id === settingsNode.entities[settingsNode.ids[1]].id) {
            // quit if there is only one node available
            return;
          }
          initialActiveNodeId = settingsNode.activeNode.id;
          cy.get('.settings-node-select').click()
            .wait(1000)
            .get('.settings-node-option').last().click()
            .wait(1000);
        });
        cy.wait(3000).then(() => {
          store.select('settingsNode').subscribe(settingsNode => {
            expect(settingsNode.activeNode.id).to.not.equal(initialActiveNodeId);
          });
        });
      });
  });

  it('[SETTINGS NODE] should receive status code 200 for get node header request', () => {
    cy.wait(4000)
      .window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          cy.request(settingsNode.activeNode.http + '/chains/main/blocks/head/header')
            .its('status')
            .should('eq', 200);
        });
      });
  });

  it('[SETTINGS NODE] should get features', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          const featuresArrayIsNotEmpty = settingsNode.activeNode.features.length > 0;
          expect(featuresArrayIsNotEmpty).to.be.true;
        });
      });
  });

  it('[SETTINGS NODE] should update octez synchronization every second', () => {
    cy.intercept('GET', '/network/peers').as('peers')
      .window()
      .its('store')
      .then(store => {
        let isOctezSwitchingAvailable = false;

        store.select('settingsNode').subscribe(settingsNode => {

          isOctezSwitchingAvailable = (Object.keys(settingsNode.entities).some(key => settingsNode.entities[key].type === 'octez')
            && settingsNode.ids.length > 1
            && settingsNode.activeNode.type !== 'octez');
          if (!isOctezSwitchingAvailable) {
            // quit if octez is absent
            return;
          }

          if (settingsNode.activeNode.type !== 'octez') {
            cy.get('.settings-node-select').click()
              .wait(1000)
              .get('.settings-node-option').last().click()
              .wait(2000);
          }
        });
        cy.wait(4000).then(() => {
          store.select('settingsNode').subscribe(() => {
            if (isOctezSwitchingAvailable) {
              cy.wait('@peers')
                .get('@peers.all').should('have.length', 7);
            }
          });
        });
      });
  });

  it('[SETTINGS NODE] should update octez synchronization every 5 seconds on a different page', () => {
    cy.intercept('GET', '/network/peers').as('peers')
      .window()
      .its('store')
      .then(store => {
        let isOctezSwitchingAvailable = false;

        store.select('settingsNode').subscribe(settingsNode => {

          isOctezSwitchingAvailable = (Object.keys(settingsNode.entities).some(key => settingsNode.entities[key].type === 'octez')
            && settingsNode.ids.length > 1
            && settingsNode.activeNode.type !== 'octez');
          if (!isOctezSwitchingAvailable) {
            // quit if octez is absent
            return;
          }

          if (settingsNode.activeNode.type !== 'octez') {
            cy.get('.settings-node-select').click()
              .wait(1000)
              .get('.settings-node-option').last().click()
              .wait(2000);
          }
        });


        cy.wait(5000).then(() => {
          store.select('settingsNode').subscribe(() => {
            if (isOctezSwitchingAvailable) {
              cy.visit(Cypress.config().baseUrl + '/#/resources/system', { timeout: 2000 })
                .wait(7500)
                .wait('@peers')
                .get('@peers.all').should('have.length', 10);
            }
          });
        });
      });
  });

});
