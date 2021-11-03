const { testForTezedge, disableFeatures } = require('../../support');

const featureNames = ['resources/system', 'resources/storage', 'resources/memory', 'state', 'logs', 'network', 'storage', 'smart-contracts'];

context('LOADING SPINNER', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
  });

  it('[LOADING SPINNER] should render loading spinner component', () => {
    cy.get('app-loading-spinner').should('exist').then(spinner => {
      expect(spinner[0].childElementCount).to.equal(0);
    });
  });

  it('[LOADING SPINNER] should show that it\'s loading the network', () => {
    cy.window()
      .its('zone')
      .then(zone => {
        cy.window()
          .its('store')
          .then(store => {
            zone.run(() => store.dispatch({
              type: 'NETWORK_ACTION_LOAD', payload: { filter: '' }
            }));
            cy.wait(1000)
              .get('app-loading-spinner .spinner', { timeout: 100 }).should('exist')
              .then(div => {
                expect(div.text()).to.equal('Loading network...');
              })
              .get('app-loading-spinner div div mat-spinner').should('be.visible');
          });
      });
  });

  it('[LOADING SPINNER] should show that it\'s loading the logs', () => {
    cy.window()
      .its('zone')
      .then(zone => {
        cy.window()
          .its('store')
          .then(store => {
            zone.run(() => store.dispatch({
              type: 'LOGS_ACTION_LOAD', payload: { filter: '' }
            }));
            cy.wait(1000)
              .get('app-loading-spinner .spinner', { timeout: 100 }).should('exist')
              .then(div => {
                expect(div.text()).to.equal('Loading logs...');
              })
              .get('app-loading-spinner div div mat-spinner').should('be.visible');
          });
      });
  });

  it('[LOADING SPINNER] should show that it\'s loading the storage blocks', () => testForTezedge(() => {
    cy.window()
      .its('zone')
      .then(zone => {
        cy.window()
          .its('store')
          .then(store => {
            zone.run(() => store.dispatch({ type: 'STORAGE_BLOCK_START', payload: { limit: 400 } }));
            cy.wait(500)
              .get('app-loading-spinner .spinner', { timeout: 100 }).should('exist')
              .then(div => {
                expect(div.text()).to.equal('Loading storage blocks...');
              })
              .get('app-loading-spinner div div mat-spinner').should('be.visible');
          });
      });
  }));

  it('[LOADING SPINNER] should show that it\'s loading system resources', () => {
    cy.window()
      .its('zone')
      .then(zone => {
        cy.window()
          .its('store')
          .then(store => {
            zone.run(() => store.dispatch({ type: 'SYSTEM_RESOURCES_LOAD' }));
            cy.wait(1000)
              .get('app-loading-spinner .spinner', { timeout: 100 }).should('exist')
              .then(div => {
                expect(div.text()).to.equal('Loading system resources...');
              })
              .get('app-loading-spinner div div mat-spinner').should('be.visible');
          });
      });
  });

  it('[LOADING SPINNER] should show that it\'s loading storage resources', () => testForTezedge(() => {
    cy.window()
      .its('zone')
      .then(zone => {
        cy.window()
          .its('store')
          .then(store => {
            zone.run(() => store.dispatch({ type: 'STORAGE_RESOURCES_LOAD' }));
            cy.wait(1000)
              .get('app-loading-spinner .spinner', { timeout: 100 }).should('exist')
              .then(div => {
                expect(div.text()).to.equal('Loading storage resources...');
              })
              .get('app-loading-spinner div div mat-spinner').should('be.visible');
          });
      });
  }));

  it('[LOADING SPINNER] should show that it\'s loading memory resources', () => {
    cy.window()
      .its('zone')
      .then(zone => {
        cy.window()
          .its('store')
          .then(store => {
            zone.run(() => store.dispatch({ type: 'MEMORY_RESOURCES_LOAD' }));
            cy.wait(1000)
              .get('app-loading-spinner .spinner', { timeout: 100 }).should('exist')
              .then(div => {
                expect(div.text()).to.equal('Loading memory resources...');
              })
              .get('app-loading-spinner div div mat-spinner').should('be.visible');
          });
      });
  });

  it('[LOADING SPINNER] should show that it\'s loading state machine', () => testForTezedge(() => {
    cy.window()
      .its('zone')
      .then(zone => {
        cy.window()
          .its('store')
          .then(store => {
            zone.run(() => store.dispatch({ type: 'STATE_MACHINE_ACTION_STATISTICS_LOAD' }));
            cy.wait(400)
              .get('app-loading-spinner .spinner', { timeout: 100 }).should('exist')
              .then(div => {
                expect(div.text()).to.equal('Loading state machine action statistics...');
              })
              .get('app-loading-spinner div div mat-spinner').should('be.visible');
          });
      });
  }));

  it('[LOADING SPINNER] should hide when resources are loaded', () => {
    cy.intercept('GET', '/resources/*').as('getSystemResources')
      .visit(Cypress.config().baseUrl + '/#/resources/system')
      .wait('@getSystemResources', { timeout: 100000 })
      .wait(1000)
      .get('app-loading-spinner .spinner', { timeout: 30000 }).should('not.exist')
      .get('app-loading-spinner div div mat-spinner', { timeout: 30000 }).should('not.exist');
  });
});
