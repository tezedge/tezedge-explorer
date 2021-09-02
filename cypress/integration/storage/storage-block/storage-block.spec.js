const isOctez = (data) => data.settingsNode.activeNode.type === 'octez';

context('STORAGE BLOCK', () => {
  beforeEach(() => {
    cy.intercept('GET', '/dev/chains/main/blocks/*').as('getStorageBlockRequest');
    cy.visit(Cypress.config().baseUrl);
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.subscribe(data => {
            if (!isOctez(data)) {
              cy.visit(Cypress.config().baseUrl + '/#/storage', { timeout: 10000 });
            }
          });
        });
    });
  });

  it('[STORAGE BLOCK] perform storage-block request successfully', () => {
    cy.wait(2000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.subscribe(data => {
            if (!isOctez(data)) {
              cy.wait('@getStorageBlockRequest').its('response.statusCode').should('eq', 200);
            }
          });
        });
    });
  });

  it('[STORAGE BLOCK] create rows for the virtual scroll table', () => {
    cy.wait(3000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.subscribe(data => {
            if (!isOctez(data)) {
              cy.visit(Cypress.config().baseUrl + '/#/storage', { timeout: 10000 });
              cy.wait('@getStorageBlockRequest').then(() => {
                cy.wait(5000).then(() => {
                  cy.get('.virtual-scroll-container')
                    .find('.virtualScrollRow');
                });
              });
            }
          });
        });
    });
  });

  it('[STORAGE BLOCK] fill the last row of the table with the last value received', () => {
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(data => {
          if (!isOctez(data)) {
            cy.visit(Cypress.config().baseUrl + '/#/storage', { timeout: 10000 });
            cy.wait(2000).then(() => {
              cy.wait('@getStorageBlockRequest').then(() => {
                cy.get('.stop-stream').click();
                cy.wait(2000).then(() => {
                  store.select('storageBlock').subscribe((data) => {
                    if (!data.stream) {
                      const lastRecord = data.entities[data.ids[data.ids.length - 1]];
                      cy.get('.virtual-scroll-container .virtualScrollRow.used')
                        .last()
                        .find('.cycle-position')
                        .should(($span) => {
                          expect($span.text().trim()).to.equal(lastRecord.cyclePosition.toString());
                        });
                    } else {
                      cy.get('.stop-stream').click();
                    }
                  });
                });
              });
            });
          }
        });
      });
  });

  it('[STORAGE BLOCK] change the value of the virtual scroll element when scrolling', () => {
    let beforeScrollValue;
    let currentState;
    cy.get('.settings-node-select mat-select-trigger span').then(nodeName => {
      if (!nodeName.text().includes('octez')) {
        cy.get('.virtualScrollRow', { timeout: 10000 }).then(() => {
          cy.window()
            .its('store')
            .then((store) => {
              store.subscribe(data => {
                if (!currentState) {
                  cy.wait(1000).then(() => {
                    cy.get('.stop-stream').click();
                    currentState = data;
                  });
                }
              });
            });

          cy.wait(2000).then(() => {
            cy.get('.stop-stream').click();

            cy.get('.virtual-scroll-container .virtualScrollRow.used')
              .last()
              .find('.storage-block-level')
              .then(($span) => {
                beforeScrollValue = $span.text();
              });

            cy.wait(2000).then(() => {
              cy.get('.virtual-scroll-container .virtualScrollRow.used')
                .first()
                .scrollIntoView({ duration: 500 });

              cy.wait(2000).then(() => {
                cy.get('.virtual-scroll-container .virtualScrollRow.used')
                  .last()
                  .find('.storage-block-level')
                  .should(($span) => {
                    expect($span.text()).to.not.equal(beforeScrollValue);
                  });
              });
            });

          });
        });
      }
    });
  });

  it('[STORAGE BLOCK] display block details on hover', () => {
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(data => {
          if (!isOctez(data)) {
            cy.visit(Cypress.config().baseUrl + '/#/storage', { timeout: 10000 });
            cy.wait('@getStorageBlockRequest')
              .then(() => {
                cy.get('.stop-stream').click();
                cy.wait(2000).then(() => {
                  store.select('storageBlock').subscribe((storageBlock) => {
                    if (!storageBlock.stream) {
                      const chainable = cy.get('.virtual-scroll-container .virtualScrollRow.used').last();
                      chainable.trigger('mouseenter');

                      cy.wait(5000).then(() => {
                        if (storageBlock.selected.hash.length) {
                          cy.get('table.storage-details-table').should('be.visible');
                          cy.get('app-storage-block-details .storage-block-header .context').should('be.visible');
                          cy.get('app-storage-block-details .storage-block-header .context').should(element => {
                            expect(element.text()).to.contain(storageBlock.availableContexts[0]);
                          });
                          if (storageBlock.availableContexts.length === 2) {
                            cy.get('app-storage-block-details .storage-block-header .node-switcher').should('be.visible');
                          }
                        }
                      });
                    } else {
                      cy.get('.stop-stream').click();
                    }
                  });
                });
              });
          }
        });
      });
  });
});
