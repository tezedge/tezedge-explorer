import { testForTezedge } from '../../../support';

const beforeStorageBlockTest = (test) => {
  let tested = false;
  cy.visit(Cypress.config().baseUrl + '/#/storage', { timeout: 100000 })
    .window()
    .its('store')
    .then({ timeout: 12500 }, store => {
      return new Cypress.Promise((resolve) => {
        setTimeout(() => resolve(), 12000);
        store.select('smartContracts').subscribe(smartContracts => {
          if (!tested && smartContracts.contracts.length > 0) {
            tested = true;
            testForTezedge(test);
            resolve();
          }
        });
      });
    });
};

context('STORAGE BLOCK', () => {
  it('[STORAGE BLOCK] create rows for the virtual scroll table', () => beforeStorageBlockTest(() => {
    cy.get('.stop-stream').click()
      .wait(1000)
      .window()
      .its('store')
      .then((store) => {
        store.select('storage').subscribe(storage => {
          if (storage.blockState.ids.length) {
            cy.get('.virtual-scroll-container', { timeout: 10000 })
              .find('.virtualScrollRow');
          }
        });
      });
  }));

  it('[STORAGE BLOCK] fill the last row of the table with the last value received', () => beforeStorageBlockTest(() => {
    cy.get('.stop-stream').click()
      .wait(1000)
      .window()
      .its('store')
      .then((store) => {
        store.select('storage').subscribe(storage => {
          if (storage.blockState.ids.length) {
            const lastRecord = storage.blockState.entities[storage.blockState.ids[storage.blockState.ids.length - 1]];
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

  it('[STORAGE BLOCK] change the value of the virtual scroll element when scrolling', () => beforeStorageBlockTest(() => {
    let beforeScrollValue;
    cy.get('.stop-stream').click()
      .wait(1000)
      .window()
      .its('store')
      .then((store) => {
        store.select('storage').subscribe(storage => {
          if (storage.blockState.ids.length) {

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

  it('[STORAGE BLOCK] display block details on hover', () => beforeStorageBlockTest(() => {
    cy.get('.stop-stream').click()
      .wait(1000)
      .window()
      .its('store')
      .then((store) => {
        store.select('storage').subscribe(storage => {
          if (!storage.blockState.stream && storage.blockState.ids.length) {
            cy.get('.virtual-scroll-container .virtualScrollRow.used')
              .last()
              .trigger('mouseenter')
              .wait(5000);
            if (storage.blockState.selected.hash.length) {
              cy.get('table.storage-details-table').should('be.visible')
                .get('app-storage-block-details .storage-block-header .context').should('be.visible')
                .get('app-storage-block-details .storage-block-header .context')
                .then(element => {
                  expect(element.text()).to.contain(storage.blockState.availableContexts[0]);
                });
              if (storage.blockState.availableContexts.length === 2) {
                cy.get('app-storage-block-details .storage-block-header .node-switcher').should('be.visible');
              }
            }
          }
        });
      });
  }));
});
