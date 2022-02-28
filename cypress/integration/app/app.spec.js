import { disableFeatures } from '../../support';

context('APP', () => {
  beforeEach(() => {
    cy.intercept('GET', '/chains/main/blocks/head/header').as('getNodeHeader')
      .visit(Cypress.config().baseUrl)
      .wait('@getNodeHeader')
      .wait(1000);
  });

  it('[APP] should have correct title in the browser tab', () => {
    cy.title().should('eq', 'TezEdge - Tezos Explorer');
  });

  it('[APP] should have status code 200 for get node header request', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          cy.request(settingsNode.activeNode.http + '/chains/main/blocks/head/header')
            .its('status')
            .should('eq', 200);
        });
      });
  });

  it('[APP] should display available features in app menu', () => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('settingsNode').subscribe(nodeSettings => {
          const possibleMenus = ['monitoring', 'mempool', 'resources', 'network', 'logs'];
          if (nodeSettings.activeNode.type !== 'octez') {
            possibleMenus.push('storage');
            possibleMenus.push('state');
            possibleMenus.push('open-api');
          }
          possibleMenus.forEach(menu => {
            if (nodeSettings.activeNode.features.some(f => f.name.includes(menu))) {
              cy.get(`#${menu}-trigger`).should('be.visible');
            }
          });
        });
      });
  });

  it('[APP] should have fuzzing option rendered successfully', () => {
    cy.get('app-navigation-menu .app-submenu a')
      .then(elements => {
        const fuzzing = Array.from(elements).find(elem => elem.textContent.includes('Fuzzing'));
        expect(fuzzing).to.have.attr('href', 'http://fuzz.tezedge.com');
        expect(fuzzing).to.have.attr('target', '_blank');
      });
  });

  it('[APP] should have documentation option rendered successfully', () => {
    cy.get('app-navigation-menu .app-submenu a')
      .then(elements => {
        const documentationElement = Array.from(elements).find(elem => elem.textContent.includes('Documentation'));
        expect(documentationElement).to.have.attr('href', 'https://docs.tezedge.com');
        expect(documentationElement).to.have.attr('target', '_blank');
      });
  });

  it('[APP] should not render synchronization in the navigation menu if the node doesn\'t contain it', () => {
    cy.window()
      .its('zone')
      .then(zone => {
        cy.window()
          .its('store')
          .then(store => {
            const featureNames = ['monitoring'];
            disableFeatures(store, zone, featureNames);

            cy.wait(1000).then(() => {
              store.select('settingsNode').subscribe(() => {
                cy.get('#monitoring-trigger').should('not.exist');
              });
            });
          });
      });
  });

  it('[APP] should not render resources in the navigation menu if the node doesn\'t contain it', () => {
    cy.window()
      .its('zone')
      .then(zone => {
        cy.window()
          .its('store')
          .then(store => {
            const featureNames = ['resources/system', 'resources/storage', 'resources/memory'];
            disableFeatures(store, zone, featureNames);

            cy.wait(1000).then(() => {
              store.select('settingsNode').subscribe(() => {
                cy.get('#resources-trigger').should('not.exist');
              });
            });
          });
      });
  });

  it('[APP] should not render mempool in the navigation menu if the node doesn\'t contain it', () => {
    cy.window()
      .its('zone')
      .then(zone => {
        cy.window()
          .its('store')
          .then(store => {
            const featureNames = ['mempool'];
            disableFeatures(store, zone, featureNames);

            cy.wait(1000).then(() => {
              store.select('settingsNode').subscribe(() => {
                cy.get('#mempool-trigger').should('not.exist');
              });
            });
          });
      });
  });

  it('[APP] should not render storage in the navigation menu if the node doesn\'t contain it', () => {
    cy.window()
      .its('zone')
      .then(zone => {
        cy.window()
          .its('store')
          .then(store => {
            const featureNames = ['storage'];
            disableFeatures(store, zone, featureNames);

            cy.wait(1000).then(() => {
              store.select('settingsNode').subscribe(() => {
                cy.get('#storage-trigger').should('not.exist');
              });
            });
          });
      });
  });

  it('[APP] should not render network in the navigation menu if the node doesn\'t contain it', () => {
    cy.window()
      .its('zone')
      .then(zone => {
        cy.window()
          .its('store')
          .then(store => {
            const featureNames = ['network'];
            disableFeatures(store, zone, featureNames);

            cy.wait(1000).then(() => {
              store.select('settingsNode').subscribe(() => {
                cy.get('#network-trigger').should('not.exist');
              });
            });
          });
      });
  });

  it('[APP] should not render logs in the navigation menu if the node doesn\'t contain it', () => {
    cy.window()
      .its('zone')
      .then(zone => {
        cy.window()
          .its('store')
          .then(store => {
            const featureNames = ['logs'];
            disableFeatures(store, zone, featureNames);

            cy.wait(1000).then(() => {
              store.select('settingsNode').subscribe(() => {
                cy.get('#logs-trigger').should('not.exist');
              });
            });
          });
      });
  });

  it('[APP] should not render state in the navigation menu if the node doesn\'t contain it', () => {
    cy.window()
      .its('zone')
      .then(zone => {
        cy.window()
          .its('store')
          .then(store => {
            const featureNames = ['state'];
            disableFeatures(store, zone, featureNames);

            cy.wait(1000).then(() => {
              store.select('settingsNode').subscribe(() => {
                cy.get('#state-trigger').should('not.exist');
              });
            });
          });
      });
  });

  it('[APP] should not render smart contracts in the navigation menu if the node doesn\'t contain it', () => {
    cy.window()
      .its('zone')
      .then(zone => {
        cy.window()
          .its('store')
          .then(store => {
            const featureNames = ['contracts'];
            disableFeatures(store, zone, featureNames);

            cy.wait(1000).then(() => {
              store.select('settingsNode').subscribe(() => {
                cy.get('#contracts-trigger').should('not.exist');
              });
            });
          });
      });
  });
});
