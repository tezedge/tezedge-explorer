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
            disableFeatures(store, zone, featureNames.filter(f => f !== 'network'));
            cy.wait(1000)
              .intercept('GET', '/v2/p2p?*', (req) => Cypress.Promise.delay(2000).then(req.reply))
              .visit(Cypress.config().baseUrl + '/#/network')
              .wait(1000)
              .get('app-loading-spinner .spinner', { timeout: 0 }).should('exist')
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
            disableFeatures(store, zone, featureNames.filter(f => f !== 'logs'));
            cy.wait(1000)
              .intercept('GET', '/v2/log?*', (req) => Cypress.Promise.delay(1500).then(req.reply))
              .visit(Cypress.config().baseUrl + '/#/logs')
              .wait(1000)
              .get('app-loading-spinner .spinner', { timeout: 0 }).should('exist')
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
            disableFeatures(store, zone, featureNames.filter(f => f !== 'storage'));
            cy.wait(1000)
              .intercept('GET', '/dev/chains/main/blocks/*', (req) => Cypress.Promise.delay(2000).then(req.reply))
              .visit(Cypress.config().baseUrl + '/#/storage')
              .wait(1000)
              .get('app-loading-spinner .spinner', { timeout: 0 }).should('exist')
              .then(div => {
                expect(div.text()).to.equal('Loading storage blocks...');
              })
              .get('app-loading-spinner div div mat-spinner').should('be.visible');
          });
      });
  }));

  it('[LOADING SPINNER] should show that it\'s loading the resources', () => {
    cy.window()
      .its('zone')
      .then(zone => {
        cy.window()
          .its('store')
          .then(store => {
            disableFeatures(store, zone, featureNames.filter(f => f !== 'resources/system'));
            cy.wait(1000)
              .intercept('GET', '/resources/*', (req) => Cypress.Promise.delay(4000).then(req.reply))
              .visit(Cypress.config().baseUrl + '/#/resources/system')
              .wait(1000)
              .get('app-loading-spinner .spinner', { timeout: 0 }).should('exist')
              .then(div => {
                expect(div.text()).to.equal('Loading system resources...');
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
            disableFeatures(store, zone, featureNames.filter(f => f !== 'state'));
            cy.wait(1000)
              .intercept('GET', '/dev/shell/automaton/*', (req) => Cypress.Promise.delay(4000).then(req.reply))
              .visit(Cypress.config().baseUrl + '/#/state')
              .wait(1000)
              .get('app-loading-spinner .spinner', { timeout: 0 }).should('exist')
              .then(div => {
                expect(div.text().includes('Loading state machine')).to.be.true;
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
