const isOctez = (data) => data.settingsNode.activeNode.type === 'octez';
const testForTezedge = (test) => {
  cy.get('app-settings-node .settings-node-select mat-select').then(select => {
    if (select.attr('id') === 'tezedge') {
      test();
    }
  });
};

context('STORAGE BLOCK', () => {
  beforeEach(() => {
    cy.intercept('GET', '/dev/chains/main/blocks/*').as('getStorageBlockRequest');
    cy.visit(Cypress.config().baseUrl);
    cy.wait(1000);
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(data => {
          if (!isOctez(data)) {
            cy.visit(Cypress.config().baseUrl + '/#/storage', { timeout: 10000 });
            cy.wait('@getStorageBlockRequest', { timeout: 100000 });
            cy.wait(1000);
          }
        });
      });
  });

  it('[STORAGE BLOCK] create rows for the virtual scroll table', () => testForTezedge(() => {
    cy.window()
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
    cy.get('.stop-stream').click();
    cy.window()
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
    cy.window()
      .its('store')
      .then((store) => {
        store.select('storageBlock').subscribe(storageBlock => {
          if (storageBlock.ids.length) {

            cy.get('.stop-stream').click();

            cy.get('.virtual-scroll-container .virtualScrollRow.used', { timeout: 10000 })
              .last()
              .find('.storage-block-level')
              .then(($span) => {
                beforeScrollValue = $span.text();
              });

            cy.wait(1000)
              .get('.virtual-scroll-container .virtualScrollRow.used')
              .first()
              .scrollIntoView({ duration: 500 });

            cy.wait(1000)
              .get('.virtual-scroll-container .virtualScrollRow.used')
              .last()
              .find('.storage-block-level')
              .should(($span) => {
                expect($span.text()).to.not.equal(beforeScrollValue);
              });
          }
        });
      });
  }));

  it('[STORAGE BLOCK] display block details on hover', () => testForTezedge(() => {
    cy.get('.stop-stream').click();
    cy.window()
      .its('store')
      .then((store) => {
        store.select('storageBlock').subscribe((storageBlock) => {
          if (!storageBlock.stream && storageBlock.ids.length) {
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
          }
        });
      });
  }));
});
