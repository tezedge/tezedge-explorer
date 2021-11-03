import { testForTezedge } from '../../support';

const beforeBakingRightsTest = (test) => {
  let tested = false;
  cy.visit(Cypress.config().baseUrl + '/#/mempool/baking', { timeout: 100000 })
    .window()
    .its('store')
    .then({ timeout: 10500 }, store => {
      return new Cypress.Promise((resolve) => {
        setTimeout(() => resolve(), 10000);
        store.select('mempool').subscribe(mempool => {
          if (!tested && mempool.bakingRightsState.bakingRights.length > 0) {
            tested = true;
            testForTezedge(test);
            resolve();
          }
        });
      });
    });
};

context('MEMPOOL BAKING RIGHTS', () => {
  it('[MEMPOOL BAKING RIGHTS] should have status code 200 for get mempool peers stats request', () => beforeBakingRightsTest(() => {
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
  }));

  it('[MEMPOOL BAKING RIGHTS] should have status code 200 for get mempool application stats request', () => beforeBakingRightsTest(() => {
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
  }));

  it('[MEMPOOL BAKING RIGHTS] should create rows for the virtual scroll table', () => beforeBakingRightsTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.bakingRightsState.bakingRights.length > 0) {
            cy.get('cdk-virtual-scroll-viewport .row', { timeout: 3000 })
              .should('be.visible');
          }
        });
      });
  }));

  it('[MEMPOOL BAKING RIGHTS] should show red text for big values for received column', () => beforeBakingRightsTest(() => {
    cy.wait(2000)
      .window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.bakingRightsState.bakingRights.length > 0) {
            if (mempool.bakingRightsState.bakingRights[0].receivedTime > 50000000) {
              cy.get('app-mempool-baking-rights cdk-virtual-scroll-viewport .row:nth-child(1) span:nth-child(4) span.text-red', { timeout: 3000 })
                .should('be.visible');
            }
          }
        });
      });
  }));

  it('[MEMPOOL BAKING RIGHTS] should show yellow text for big values for received column', () => beforeBakingRightsTest(() => {
    cy.wait(2000)
      .window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.bakingRightsState.bakingRights.length > 0) {
            const index = mempool.bakingRightsState.bakingRights.findIndex(e => e.receivedTime > 20000000 && e.receivedTime < 50000000);
            if (index !== -1 && index <= 20) {
              cy.get('.row:not(.head):nth-child(' + (index + 1) + ') span:nth-child(4) span.text-yellow', { timeout: 3000 })
                .should('be.visible');
            }
          }
        });
      });
  }));

  it('[MEMPOOL BAKING RIGHTS] should create histogram for the same number of nodes as in the table', () => beforeBakingRightsTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.bakingRightsState.bakingRights.length > 0) {
            cy.get('app-mempool-baking-rights-graph div div div.font-500', { timeout: 2000 })
              .then(element => {
                expect(element.text()).to.equal(`Received time count histogram - ${mempool.bakingRightsState.bakingRights.length} nodes`);
              });
          }
        });
      });
  }));

  it('[MEMPOOL BAKING RIGHTS] should use same block as in current block find in the toolbar', () => beforeBakingRightsTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.bakingRightsState.bakingRights.length > 0) {
            let mempoolBlock;
            cy.get('app-mempool-baking-rights div div .block', { timeout: 2000 })
              .then(element => mempoolBlock = element.text())
              .get('.app-status-bar div div.foreground-7 div:nth-child(3) .foreground', { timeout: 2000 })
              .then(element => expect(mempoolBlock).to.includes(element.text()));
          }
        });
      });
  }));
});
