const isSandbox = (data) => data.settingsNode.activeNode.id.includes('sandbox');

context('STORAGE BLOCK', () => {
  beforeEach(() => {
    cy.intercept('GET', '/dev/chains/main/blocks/*').as('getStorageBlockRequest');
    cy.visit(Cypress.config().baseUrl);
    cy.wait(5000);
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(data => {
          if (isSandbox(data)) {
            cy.visit(Cypress.config().baseUrl + '/#/storage', { timeout: 10000 });
            cy.wait(3000);
          }
        });
      });
  });

  it('[STORAGE BLOCK] perform storage-block request successfully', () => {
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(data => {
          if (isSandbox(data)) {
            cy.wait('@getStorageBlockRequest').its('response.statusCode').should('eq', 200);
          }
        });
      });
  });

  it('[STORAGE BLOCK] create rows for the virtual scroll table', () => {
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(data => {
          if (isSandbox(data)) {
            cy.wait('@getStorageBlockRequest')
              .then(() => {
                cy.wait(2000);
                cy.get('.virtual-scroll-container')
                  .find('.virtualScrollRow');
              });
          }
        });
      });
  });

  it('[STORAGE BLOCK] fill the last row of the table with the last value received', () => {
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(data => {
          if (isSandbox(data)) {
            cy.visit(Cypress.config().baseUrl + '/#/storage', { timeout: 10000 });
            cy.wait('@getStorageBlockRequest')
              .then(() => {
                cy.get('.stop-stream').click();
                cy.wait(2000);

                store.select('storageBlock')
                  .subscribe((data) => {
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
          }
        });
      });
  });

  it('[STORAGE BLOCK] change the value of the virtual scroll element when scrolling', () => {
    let beforeScrollValue;

    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(data => {
          if (isSandbox(data)) {

            cy.wait(1000)
              .then(() => {
                cy.get('.stop-stream').click();

                store.select('storageBlock')
                  .subscribe((data) => {
                    if (!data.stream) {
                      cy.get('.virtual-scroll-container .virtualScrollRow.used')
                        .last()
                        .find('.storage-block-level')
                        .then(($span) => {
                          beforeScrollValue = $span.text();
                        });

                      cy.wait(2000);

                      cy.get('.virtual-scroll-container .virtualScrollRow.used')
                        .first()
                        .scrollIntoView({ duration: 500 });

                      cy.wait(2000);

                      cy.get('.virtual-scroll-container .virtualScrollRow.used')
                        .last()
                        .find('.storage-block-level')
                        .should(($span) => {
                          expect($span.text()).to.not.equal(beforeScrollValue);
                        });
                    } else {
                      cy.get('.stop-stream').click();
                    }
                  });
              });
          }
        });
      });
  });
});
