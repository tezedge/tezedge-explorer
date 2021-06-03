
context('STORAGE RESOURCES', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
    cy.wait(1000);
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(data => {
          const isOcaml = data.settingsNode.activeNode.id.includes('ocaml');
          if (isOcaml) {
            cy.onlyOn(false);
          } else {
            cy.visit(Cypress.config().baseUrl + '/#/resources/storage', { timeout: 10000 });
            cy.intercept('GET', '/stats/context*').as('getStorageResources');
            cy.wait(1000);
          }
        });
      });
  });

  it('[STORAGE RESOURCES] should perform get memory resources request successfully', () => {
    cy.wait('@getStorageResources').its('response.statusCode').should('eq', 200);
  });

  it('[STORAGE RESOURCES] should parse storage stats RPC response successfully', () => {
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('resources').subscribe(store => {
            const resources = store.storageResources;
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
              cy.wrap(ctx.actionsCount).should('not.be.undefined');
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

            // TODO: test also the total times

          });
        });
    });
  });

  it('[STORAGE RESOURCES] should render storage statistics successfully', () => {
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('resources').subscribe(store => {
            const resources = store.storageResources;
            cy.get('.operation-list .operation').should('have.length', resources.operationsContext.length + 1);

            cy.get(`.operation-list .operation:nth-child(1) app-storage-resources-mini-graph`).should('have.length', 2);

            resources.operationsContext.forEach((operation, i) => {
              cy.get(`.operation-list .operation:nth-child(${i + 2}) app-storage-resources-mini-graph`).should('have.length', 7);
              cy.get(`.operation-list .operation:nth-child(${i + 2}) .slice-header span.text-uppercase`).should((span) => {
                expect(span.text()).to.equal(resources.contextSliceNames[i + 2]);
              });
            });
          });
        });
    });
  });
});
