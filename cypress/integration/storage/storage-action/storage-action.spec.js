context('storage-action', () => {
  beforeEach(() => {
    cy.intercept('GET', '/dev/chains/main/blocks/*').as('getStorageBlockRequest');
    cy.intercept('GET', '/dev/chains/main/actions/blocks/*').as('getStorageActionRequest');
    cy.visit(Cypress.config().baseUrl);
    cy.wait(5000);
    cy.visit(Cypress.config().baseUrl + '/#/storage', {timeout: 10000});
    cy.wait('@getStorageBlockRequest')
      .then(() => {
        cy.wait(2000);
        cy.get('.virtual-scroll-container .virtualScrollRow.used')
          .last()
          .find('.storage-block-hash')
          .then(($span) => {
            $span.click();
          });
      });
  })

  it('[storage-action] perform storage-action request successfully', () => {
    cy.wait('@getStorageActionRequest').its('response.statusCode').should('eq', 200);
  })

  it('[storage-action] create rows for the virtual scroll table', () => {
    cy.wait('@getStorageActionRequest')
      .then(() => {
        cy.wait(2000);
        cy.get('.virtual-scroll-container')
          .find('.virtualScrollRow');
      })
  })

  it('[storage-action] fill the last row of the table with the last value received', () => {
    cy.wait('@getStorageActionRequest')
      .then(() => {
        cy.wait(2000);
        cy.window()
          .its('store')
          .then((store) => {
            store.select('storageAction')
              .subscribe((data) => {

                const lastRecord = data.entities[data.ids[data.ids.length - 1]];

                cy.get('.virtual-scroll-container .virtualScrollRow.used')
                  .last()
                  .find('.storage-action-time')
                  .should(($span) => {
                    expect($span.text().trim()).to.contain(lastRecord.timeStorage.toString());
                    expect($span.text().trim()).to.contain(lastRecord.timeProtocol.toString());
                  })
              })

          })
      })

  })
})
