import { beforeEachForTezedge, testForTezedge } from '../../support';

context('STORAGE RESOURCES', () => {
  beforeEach(() => {
    beforeEachForTezedge(() => {
      cy.intercept('GET', '/stats/context*').as('getStorageResources')
        .visit(Cypress.config().baseUrl + '/#/resources/storage', { timeout: 100000 })
        .wait('@getStorageResources')
        .wait(1000);
    });
  });

  it('[STORAGE RESOURCES] should parse storage stats RPC response', () => testForTezedge(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('resources').subscribe(store => {
          const resources = store.storageResourcesState.storageResources;
          if (resources) {
            expect(resources).not.to.be.undefined;
            Object.keys(resources).forEach(key => {
              expect(resources[key]).not.to.be.undefined;
            });

            const isOperationArraySortedByTotalTime = (array) => {
              for (let i = 0; i < array.length - 1; i++) {
                if (array[i].totalTime < array[i + 1].totalTime) {
                  return false;
                }
              }
              return true;
            };

            expect(isOperationArraySortedByTotalTime(resources.operationsContext)).to.be.true;

            const assertContext = (ctx) => {
              expect(ctx.queriesCount).not.to.be.undefined;
              expect(ctx.totalTime).not.to.be.undefined;
              if (ctx.columns.length) {
                ctx.columns.forEach(col => {
                  let squareCount = 0;
                  let timeInTenMicroseconds = col.totalTime * 100000;
                  while (timeInTenMicroseconds > 1) {
                    timeInTenMicroseconds /= 10;
                    squareCount++;
                  }
                  expect(col.squareCount).to.equal(Math.min(squareCount, 8));
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
            expect(resources.contextSliceNames.some(slice => slice.includes('_'))).to.be.false;
          }
        });
      });
  }));

  it('[STORAGE RESOURCES] should render storage statistics', () => testForTezedge(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('resources').subscribe(store => {
          const resources = store.storageResourcesState.storageResources;
          if (resources) {
            cy.get('.operation-list .operation', { timeout: 10000 }).should('have.length', resources.operationsContext.length + 1)
              .get(`.operation-list .operation:nth-child(1) app-storage-resources-mini-graph`).should('have.length', 2);

            resources.operationsContext.forEach((operation, i) => {
              cy.get(`.operation-list .operation:nth-child(${i + 2}) app-storage-resources-mini-graph`).should('have.length', 7)
                .get(`.operation-list .operation:nth-child(${i + 2}) .slice-header span.text-uppercase`)
                .then((span) => {
                  expect(span.text()).to.equal(resources.contextSliceNames[i + 2]);
                });
            });
          }
        });
      });
  }));

  it('[STORAGE RESOURCES] should display switcher', () => testForTezedge(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('resources').subscribe(resources => {
          if (resources.storageResourcesState && resources.storageResourcesState.availableContexts.length) {
            cy.get('app-storage-resources .storage-toolbar .context', { timeout: 5000 }).should('be.visible')
              .get('app-storage-resources .storage-toolbar .toolbar-right').should('be.visible');

            const contexts = resources.storageResourcesState.availableContexts;
            if (contexts.length === 2) {
              cy.get('app-storage-resources .storage-toolbar .node-switcher', { timeout: 5000 }).should('be.visible');
            } else if (contexts.length === 1) {
              cy.get('app-storage-resources .storage-toolbar .context', { timeout: 5000 })
                .then(element => {
                  expect(element.text()).to.contain(contexts[0]);
                })
                .get('app-storage-resources .storage-toolbar .node-switcher').should('not.exist');
            }
          }
        });
      });
  }));

  it('[STORAGE RESOURCES] should change context on switcher click', () => testForTezedge(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('resources').subscribe(resources => {
          if (resources.storageResourcesState) {
            cy.get('app-storage-resources .storage-toolbar .context', { timeout: 5000 }).should('be.visible');

            let currentContext = '';
            cy.get('app-storage-resources .storage-toolbar .context').then(div => {
              currentContext = div.text();
            });
            const contexts = resources.storageResourcesState.availableContexts;
            if (contexts.length === 2) {
              cy.get('app-storage-resources .storage-toolbar .node-switcher', { timeout: 10000 }).should('be.visible');

              const secondContext = resources.storageResourcesState.availableContexts[1];
              if (!currentContext.includes(secondContext)) {
                cy.get('app-storage-resources .storage-toolbar .node-switcher')
                  .click()
                  .wait(1000)
                  .get('app-storage-resources .storage-toolbar .context')
                  .then(div => {
                    expect(div.text()).to.contain(secondContext);
                  });
              }
            }
          }
        });
      });
  }));
});
