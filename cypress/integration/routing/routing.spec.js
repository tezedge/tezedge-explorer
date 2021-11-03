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
            const featureName = 'resources/system';
            disableFeatureAndExpectToBeDisabled(store, zone, featureName);

            cy.wait(1000).then(() => {
              store.select('settingsNode').subscribe(settingsNode => {
                if (!settingsNode.activeNode.features.some(f => f.name === featureName)) {
                  cy.visit(Cypress.config().baseUrl + '/#/resources/system', { timeout: 2000 })
                    .url().should('not.include', '/resources/system');
                }
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
          const featureName = 'resources/storage';
          disableFeatureAndExpectToBeDisabled(store, zone, featureName);

          cy.wait(1000).then(() => {
            store.select('settingsNode').subscribe(settingsNode => {
              if (!settingsNode.activeNode.features.some(f => f.name === featureName)) {
                cy.visit(Cypress.config().baseUrl + '/#/resources/storage', { timeout: 2000 })
                  .url().should('not.include', '/resources/storage');
              }
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
          const featureName = 'resources/memory';
          disableFeatureAndExpectToBeDisabled(store, zone, featureName);

          cy.wait(1000).then(() => {
            store.select('settingsNode').subscribe(settingsNode => {
              if (!settingsNode.activeNode.features.some(f => f.name === featureName)) {
                cy.visit(Cypress.config().baseUrl + '/#/resources/memory', { timeout: 2000 })
                  .url().should('not.include', '/resources/memory');
              }
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
          const featureName = 'storage';
          disableFeatureAndExpectToBeDisabled(store, zone, featureName);

          cy.wait(1000).then(() => {
            store.select('settingsNode').subscribe(settingsNode => {
              if (!settingsNode.activeNode.features.some(f => f.name === featureName)) {
                cy.visit(Cypress.config().baseUrl + '/#/storage', { timeout: 2000 })
                  .url().should('not.include', '/storage');
              }
            });
          });
        });
    });
  });

  it('[ROUTING] guard should block routing to storage action page if the feature is missing', () => {
    cy.window().its('zone').then(zone => {
      cy.window()
        .its('store')
        .then(store => {
          const featureName = 'storage-action';
          disableFeatureAndExpectToBeDisabled(store, zone, featureName);

          cy.wait(1000).then(() => {
            store.select('settingsNode').subscribe(settingsNode => {
              if (!settingsNode.activeNode.features.some(f => f.name === featureName)) {
                cy.visit(Cypress.config().baseUrl + '/#/storage/123456', { timeout: 2000 })
                  .url().should('not.include', '/storage/123456');
              }
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
          const featureName = 'logs';
          disableFeatureAndExpectToBeDisabled(store, zone, featureName);

          cy.wait(1000).then(() => {
            store.select('settingsNode').subscribe(settingsNode => {
              if (!settingsNode.activeNode.features.some(f => f.name === featureName)) {
                cy.visit(Cypress.config().baseUrl + '/#/logs', { timeout: 2000 })
                  .url().should('not.include', '/logs');
              }
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
          const featureName = 'state';
          disableFeatureAndExpectToBeDisabled(store, zone, featureName);

          cy.wait(1000).then(() => {
            store.select('settingsNode').subscribe(settingsNode => {
              if (!settingsNode.activeNode.features.some(f => f.name === featureName)) {
                cy.visit(Cypress.config().baseUrl + '/#/state', { timeout: 2000 })
                  .url().should('not.include', '/state');
              }
            });
          });
        });
    });
  });
});


const disableFeatureAndExpectToBeDisabled = (store, zone, featureName) => {
  store.select('settingsNode').subscribe(settingsNode => {
    if (settingsNode.activeNode.features.some(f => f.name === featureName)) {
      const activeNode = { ...settingsNode.activeNode };
      activeNode.features = activeNode.features.filter(f => f.name !== featureName);
      activeNode.connected = false;
      const payload = {
        activeNode,
        header: settingsNode.entities[settingsNode.ids[0]].header,
        features: settingsNode.activeNode.features.filter(f => f.name !== featureName)
      };
      zone.run(() => store.dispatch({
        type: 'SETTINGS_NODE_CHANGE', payload: { activeNode: activeNode }
      }));
      zone.run(() => store.dispatch({
        type: 'SETTINGS_NODE_LOAD_SUCCESS', payload: payload
      }));
    }
  });
};
