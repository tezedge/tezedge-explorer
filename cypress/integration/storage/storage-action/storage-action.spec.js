context('storage-action', () => {
  beforeEach(() => {
    cy.intercept('GET', '/dev/chains/main/blocks/*').as('getStorageBlockRequest')
      .intercept('GET', '/dev/chains/main/actions/blocks/*/*').as('getStorageActionRequest')
      .visit(Cypress.config().baseUrl)
      .wait(5000)
      .visit(Cypress.config().baseUrl + '/#/storage', { timeout: 30000 })
      .wait('@getStorageBlockRequest')
      .wait(2000)
      .get('.virtual-scroll-container .virtualScrollRow.used')
      .last()
      .find('.storage-block-hash')
      .trigger('click');
  });

  // it('[storage-action] perform storage-action request successfully', () => {
  //   cy.wait('@getStorageActionRequest').its('response.statusCode').should('eq', 200);
  // })

  // it('[storage-action] create rows for the virtual scroll table', () => {
  //   cy.wait('@getStorageActionRequest')
  //     .then(() => {
  //       cy.wait(2000);
  //       cy.get('.virtual-scroll-container')
  //         .find('.virtualScrollRow');
  //     })
  // })
  //
  // it('[storage-action] fill the last row of the table with the last value received', () => {
  //   cy.wait('@getStorageActionRequest')
  //     .then(() => {
  //       cy.wait(2000);
  //       cy.window()
  //         .its('store')
  //         .then((store) => {
  //           store.select('storageAction')
  //             .subscribe((data) => {
  //
  //               const firstRecord = data.entities[data.ids[0]];
  //
  //               cy.get('.virtual-scroll-container .virtualScrollRow.used')
  //                 .first()
  //                 .find('.storage-action-time')
  //                 .should(($span) => {
  //                   expect($span.text().trim()).to.contain(firstRecord.timeStorage.toString());
  //                   expect($span.text().trim()).to.contain(firstRecord.timeProtocol.toString());
  //                 })
  //             })
  //
  //         })
  //     })
  //
  // })
});
