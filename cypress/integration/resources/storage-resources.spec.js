const isNotOctez = (data) => data.settingsNode.activeNode.type !== 'octez';

context('STORAGE RESOURCES', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
    cy.wait(1000);
    cy.visit(Cypress.config().baseUrl + '/#/resources/storage', { timeout: 10000 });
    cy.intercept('GET', '/stats/context*').as('getStorageResources');
    cy.wait(1000);
  });

  it('[STORAGE RESOURCES] should perform get memory resources request', () => {
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe((store) => {
          if (isNotOctez(store)) {
            cy.wait('@getStorageResources').its('response.statusCode').should('eq', 200);
          }
        });
      });
  });

  it('[STORAGE RESOURCES] should parse storage stats RPC response successfully', () => {
    cy.wait('@getStorageResources').then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.subscribe(data => {
            if (isNotOctez(data)) {
              store.select('resources').subscribe(store => {
                const resources = store.storageResourcesState.storageResources;
                if (resources) {
                  cy.wrap(resources).should('not.be.undefined');
                  Object.keys(resources).forEach(key => {
                    cy.wrap(resources[key]).should('not.be.undefined');
                  });

                  const isOperationArraySortedByTotalTime = (array) => {
                    for (let i = 0; i < array.length - 1; i++) {
                      if (array[i].totalTime < array[i + 1].totalTime) {
                        return false;
                      }
                    }
                    return true;
                  };

                  cy.wrap(isOperationArraySortedByTotalTime(resources.operationsContext)).should('eq', true);

                  const assertContext = (ctx) => {
                    cy.wrap(ctx.queriesCount).should('not.be.undefined');
                    cy.wrap(ctx.totalTime).should('not.be.undefined');
                    if (ctx.columns.length) {
                      ctx.columns.forEach(col => {
                        let squareCount = 0;
                        let timeInTenMicroseconds = col.totalTime * 100000;
                        while (timeInTenMicroseconds > 1) {
                          timeInTenMicroseconds /= 10;
                          squareCount++;
                        }
                        cy.wrap(col.squareCount).should('eq', Math.min(squareCount, 8));
                      });
                    }
                  };

                  assertContext(resources.commitContext);
                  assertContext(resources.checkoutContext);
                  resources.operationsContext.forEach((operation) => {
                    assertContext(operation.mem);
                    assertContext(operation.find);
                    assertContext(operation.findTree);
                    assertContext(operation.add);
                    assertContext(operation.addTree);
                    assertContext(operation.remove);
                  });
                  cy.wrap(resources.contextSliceNames.some(slice => slice.includes('_'))).should('be.false');
                }
              });
            }
          });
        });
    });
  });

  it('[STORAGE RESOURCES] should render storage statistics', () => {
    cy.wait('@getStorageResources').then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.subscribe(data => {
            if (isNotOctez(data)) {
              store.select('resources').subscribe(store => {
                const resources = store.storageResourcesState.storageResources;
                if (resources) {
                  cy.get('.operation-list .operation', { timeout: 10000 }).should('have.length', resources.operationsContext.length + 1);

                  cy.get(`.operation-list .operation:nth-child(1) app-storage-resources-mini-graph`).should('have.length', 2);

                  resources.operationsContext.forEach((operation, i) => {
                    cy.get(`.operation-list .operation:nth-child(${i + 2}) app-storage-resources-mini-graph`).should('have.length', 7);
                    cy.get(`.operation-list .operation:nth-child(${i + 2}) .slice-header span.text-uppercase`).should((span) => {
                      expect(span.text()).to.equal(resources.contextSliceNames[i + 2]);
                    });
                  });
                }
              });
            }
          });
        });
    });
  });

  it('[STORAGE RESOURCES] should display switcher', () => {
    cy.wait('@getStorageResources').then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.subscribe(data => {
            if (isNotOctez(data)) {
              store.select('resources').subscribe(resources => {
                if (resources.storageResourcesState && resources.storageResourcesState.availableContexts.length) {
                  cy.get('app-storage-resources .storage-toolbar .context', { timeout: 5000 }).should('be.visible');
                  cy.get('app-storage-resources .storage-toolbar .toolbar-right').should('be.visible');

                  const contexts = resources.storageResourcesState.availableContexts;
                  if (contexts.length === 2) {
                    cy.get('app-storage-resources .storage-toolbar .node-switcher', { timeout: 5000 }).should('be.visible');
                  } else if (contexts.length === 1) {
                    cy.get('app-storage-resources .storage-toolbar .context', { timeout: 5000 }).should(element => {
                      expect(element.text()).to.contain(contexts[0]);
                    });
                    cy.get('app-storage-resources .storage-toolbar .node-switcher').should('not.exist');
                  }
                }
              });
            }
          });
        });
    });
  });

  it('[STORAGE RESOURCES] should change context on switcher click', () => {
    cy.wait('@getStorageResources').then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.subscribe(data => {
            if (isNotOctez(data)) {
              store.select('resources').subscribe(resources => {
                if (resources.storageResourcesState) {
                  cy.get('app-storage-resources .storage-toolbar .context', { timeout: 5000 }).should('be.visible');

                  let currentContext = '';
                  cy.get('app-storage-resources .storage-toolbar .context').should(div => {
                    currentContext = div.text();
                  });
                  const contexts = resources.storageResourcesState.availableContexts;
                  if (contexts.length === 2) {
                    cy.get('app-storage-resources .storage-toolbar .node-switcher', { timeout: 10000 }).should('be.visible');

                    const secondContext = resources.storageResourcesState.availableContexts[1];
                    if (!currentContext.includes(secondContext)) {
                      cy.get('app-storage-resources .storage-toolbar .node-switcher').click();
                      cy.wait(1000).then(() => {
                        cy.get('app-storage-resources .storage-toolbar .context').should(div => {
                          expect(div.text()).to.contain(secondContext);
                        });
                      });
                    }
                  }
                }
              });
            }
          });
        });
    });
  });
});
