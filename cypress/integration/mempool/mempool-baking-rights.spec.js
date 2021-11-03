context('MEMPOOL BAKING RIGHTS', () => {
  beforeEach(() => {
    cy.intercept('GET', '/dev/shell/automaton/stats/current_head/peers?level=*').as('getMempoolPeersStats')
      .intercept('GET', '/dev/shell/automaton/stats/current_head/application?level=*').as('getMempoolApplicationStats')
      .visit(Cypress.config().baseUrl + '/#/mempool/baking', { timeout: 30000 })
      .wait('@getMempoolPeersStats', { timeout: 100000 })
      .wait('@getMempoolApplicationStats', { timeout: 100000 })
      .wait(1000);
  });

  it('[MEMPOOL BAKING RIGHTS] should have status code 200 for get mempool peers stats request', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          store.select('networkStats').subscribe(networkStats => {
            const currentBlock = networkStats.lastAppliedBlock.hash;
            const level = networkStats.lastAppliedBlock.level;
            if (currentBlock && level) {
              cy.request(`${settingsNode.activeNode.http}/dev/shell/automaton/stats/current_head/peers?level=${level}`)
                .its('status')
                .should('eq', 200);
            }
          });
        });
      });
  });

  it('[MEMPOOL BAKING RIGHTS] should have status code 200 for get mempool application stats request', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          store.select('networkStats').subscribe(networkStats => {
            const currentBlock = networkStats.lastAppliedBlock.hash;
            const level = networkStats.lastAppliedBlock.level;
            if (currentBlock && level) {
              cy.request(`${settingsNode.activeNode.http}/dev/shell/automaton/stats/current_head/application?level=${level}`)
                .its('status')
                .should('eq', 200);
            }
          });
        });
      });
  });

  it('[MEMPOOL BAKING RIGHTS] should create rows for the virtual scroll table', () => {
    cy.get('cdk-virtual-scroll-viewport .row')
      .should('be.visible');
  });

  it('[MEMPOOL BAKING RIGHTS] should show red text for big values for received column', () => {
    cy.wait(2000)
      .window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.bakingRightsState.bakingRights.length) {
            if (mempool.bakingRightsState.bakingRights[0].receivedTime > 50000000) {
              cy.get('.row:not(.head):first-child span:nth-child(4) span.text-red')
                .should('be.visible');
            }
          }
        });
      });
  });

  it('[MEMPOOL BAKING RIGHTS] should show yellow text for big values for received column', () => {
    cy.wait(2000)
      .window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.bakingRightsState.bakingRights.length) {
            const index = mempool.bakingRightsState.bakingRights.findIndex(e => e.receivedTime > 20000000 && e.receivedTime < 50000000);
            if (index !== -1) {
              cy.get('.row:not(.head):nth-child(' + (index + 1) + ') span:nth-child(4) span.text-yellow')
                .should('be.visible');
            }
          }
        });
      });
  });
});
