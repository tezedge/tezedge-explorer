const { testForTezedge } = require('../../../support');

context('STORAGE BLOCK', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl)
      .wait(1000)
      .get('app-settings-node .settings-node-select mat-select')
      .then(select => {
        if (select.attr('id') === 'tezedge') {
          cy.intercept('GET', '/dev/chains/main/blocks/*').as('getStorageBlockRequest')
            .visit(Cypress.config().baseUrl + '/#/storage', { timeout: 100000 })
            .wait('@getStorageBlockRequest', { timeout: 200000 })
            .wait(1000);
        }
      });
  });

  it('[STORAGE BLOCK] create rows for the virtual scroll table', () => testForTezedge(() => {
    cy.get('.stop-stream').click()
      .wait(1000)
      .window()
      .its('store')
      .then((store) => {
        store.select('storageBlock').subscribe(storageBlock => {
          if (storageBlock.ids.length) {
            cy.get('.virtual-scroll-container', { timeout: 10000 })
              .find('.virtualScrollRow');
          }
        });
      });
  }));

  it('[STORAGE BLOCK] fill the last row of the table with the last value received', () => testForTezedge(() => {
    cy.get('.stop-stream').click()
      .wait(1000)
      .window()
      .its('store')
      .then((store) => {
        store.select('storageBlock').subscribe(storageBlock => {
          if (storageBlock.ids.length) {
            const lastRecord = storageBlock.entities[storageBlock.ids[storageBlock.ids.length - 1]];
            cy.get('.virtual-scroll-container .virtualScrollRow.used', { timeout: 10000 })
              .last()
              .find('.cycle-position')
              .should(($span) => {
                expect($span.text().trim()).to.equal(lastRecord.cyclePosition.toString());
              });
          }
        });
      });
  }));

  it('[STORAGE BLOCK] change the value of the virtual scroll element when scrolling', () => testForTezedge(() => {
    let beforeScrollValue;
    cy.get('.stop-stream').click()
      .wait(1000)
      .window()
      .its('store')
      .then((store) => {
        store.select('storageBlock').subscribe(storageBlock => {
          if (storageBlock.ids.length) {

            cy.get('.stop-stream')
              .click()

              .get('.virtual-scroll-container .virtualScrollRow.used', { timeout: 10000 })
              .last()
              .find('.storage-block-level')
              .then(($span) => {
                beforeScrollValue = $span.text();
              })

              .wait(1000)
              .get('.virtual-scroll-container .virtualScrollRow.used')
              .first()
              .scrollIntoView({ duration: 500 })

              .wait(1000)
              .get('.virtual-scroll-container .virtualScrollRow.used')
              .last()
              .find('.storage-block-level')
              .then(($span) => {
                expect($span.text()).to.not.equal(beforeScrollValue);
              });
          }
        });
      });
  }));

  it('[STORAGE BLOCK] display block details on hover', () => testForTezedge(() => {
    cy.get('.stop-stream').click()
      .wait(1000)
      .window()
      .its('store')
      .then((store) => {
        store.select('storageBlock').subscribe((storageBlock) => {
          if (!storageBlock.stream && storageBlock.ids.length) {
            cy.get('.virtual-scroll-container .virtualScrollRow.used')
              .last()
              .trigger('mouseenter')
              .wait(5000);
            if (storageBlock.selected.hash.length) {
              cy.get('table.storage-details-table').should('be.visible')
                .get('app-storage-block-details .storage-block-header .context').should('be.visible')
                .get('app-storage-block-details .storage-block-header .context')
                .then(element => {
                  expect(element.text()).to.contain(storageBlock.availableContexts[0]);
                });
              if (storageBlock.availableContexts.length === 2) {
                cy.get('app-storage-block-details .storage-block-header .node-switcher').should('be.visible');
              }
            }
          }
        });
      });
  }));
});
