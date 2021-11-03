import { disableFeatures } from '../../support';

context('ROUTING', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl)
      .wait(1000);
  });

  it('[ROUTING] guard should block routing to system resources if the feature is missing', () => {
    cy.window()
      .its('zone')
      .then(zone => {
        cy.window()
          .its('store')
          .then(store => {
            const featureNames = ['resources/system'];
            disableFeatures(store, zone, featureNames);

            cy.wait(1000).then(() => {
              store.select('settingsNode').subscribe(() => {
                cy.visit(Cypress.config().baseUrl + '/#/resources/system', { timeout: 2000 })
                  .url().should('not.include', '/resources/system');
              });
            });
          });
      });
  });

  it('[ROUTING] guard should block routing to storage resources if the feature is missing', () => {
    cy.window().its('zone').then(zone => {
      cy.window()
        .its('store')
        .then(store => {
          const featureNames = ['resources/storage'];
          disableFeatures(store, zone, featureNames);

          cy.wait(1000).then(() => {
            store.select('settingsNode').subscribe(() => {
              cy.visit(Cypress.config().baseUrl + '/#/resources/storage', { timeout: 2000 })
                .url().should('not.include', '/resources/storage');
            });
          });
        });
    });
  });

  it('[ROUTING] guard should block routing to memory resources if the feature is missing', () => {
    cy.window().its('zone').then(zone => {
      cy.window()
        .its('store')
        .then(store => {
          const featureNames = ['resources/memory'];
          disableFeatures(store, zone, featureNames);

          cy.wait(1000).then(() => {
            store.select('settingsNode').subscribe(() => {
              cy.visit(Cypress.config().baseUrl + '/#/resources/memory', { timeout: 2000 })
                .url().should('not.include', '/resources/memory');
            });
          });
        });
    });
  });

  it('[ROUTING] guard should block routing to storage page if the feature is missing', () => {
    cy.window().its('zone').then(zone => {
      cy.window()
        .its('store')
        .then(store => {
          const featureNames = ['storage'];
          disableFeatures(store, zone, featureNames);

          cy.wait(1000).then(() => {
            store.select('settingsNode').subscribe(() => {
              cy.visit(Cypress.config().baseUrl + '/#/storage', { timeout: 2000 })
                .url().should('not.include', '/storage')
                .get('#storage-trigger').should('not.exist');
            });
          });
        });
    });
  });

  it('[ROUTING] guard should block routing to logs page if the feature is missing', () => {
    cy.window().its('zone').then(zone => {
      cy.window()
        .its('store')
        .then(store => {
          const featureNames = ['logs'];
          disableFeatures(store, zone, featureNames);

          cy.wait(1000).then(() => {
            store.select('settingsNode').subscribe(() => {
              cy.visit(Cypress.config().baseUrl + '/#/logs', { timeout: 2000 })
                .url().should('not.include', '/logs')
                .get('#logs-trigger').should('not.exist');
            });
          });
        });
    });
  });

  it('[ROUTING] guard should block routing to network page if the feature is missing', () => {
    cy.window().its('zone').then(zone => {
      cy.window()
        .its('store')
        .then(store => {
          const featureNames = ['network'];
          disableFeatures(store, zone, featureNames);

          cy.wait(1000).then(() => {
            store.select('settingsNode').subscribe(() => {
              cy.visit(Cypress.config().baseUrl + '/#/network', { timeout: 2000 })
                .url().should('not.include', '/network')
                .get('#network-trigger').should('not.exist');
            });
          });
        });
    });
  });

  it('[ROUTING] guard should block routing to state machine page if the feature is missing', () => {
    cy.window().its('zone').then(zone => {
      cy.window()
        .its('store')
        .then(store => {
          const featureNames = ['state'];
          disableFeatures(store, zone, featureNames);

          cy.wait(1000).then(() => {
            store.select('settingsNode').subscribe(() => {
              cy.visit(Cypress.config().baseUrl + '/#/state', { timeout: 2000 })
                .url().should('not.include', '/state')
                .get('#state-trigger').should('not.exist');
            });
          });
        });
    });
  });
});
