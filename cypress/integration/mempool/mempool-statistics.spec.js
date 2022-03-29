import { testForTezedge } from '../../support';

context('MEMPOOL STATISTICS', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/#/mempool/statistics', { timeout: 30000 })
      .wait(1000);
  });

  it('[MEMPOOL STATISTICS] should hava mempool statistics option available', () => testForTezedge(() => {
    cy.get('app-mempool .tabs .tab:last-child')
      .should('be.visible')
      .should(tab => expect(tab.text().trim()).to.equal('statistics'));
  }));

  // it('[MEMPOOL STATISTICS] should show yellow text for big values for delta column', () => {
  //   cy.wait(500)
  //     .window()
  //     .its('store')
  //     .then(store => {
  //       store.select('mempool').subscribe(mempool => {
  //         if (mempool.statisticsState.operations.length) {
  //           const index = mempool.statisticsState.operations.findIndex(e => e.delta > 20000000 && e.delta < 50000000);
  //           if (index !== -1) {
  //             cy.get('.row:not(.head):nth-child(' + (index + 1) + ') span:nth-child(4) span.text-yellow')
  //               .should('be.visible');
  //           }
  //         }
  //       });
  //     });
  // });
  //
  // it('[MEMPOOL STATISTICS] should select operation from the table', () => {
  //   cy.window()
  //     .its('store')
  //     .then(store => {
  //       cy.get('cdk-virtual-scroll-viewport')
  //         .scrollTo('bottom')
  //         .wait(1000)
  //         .find('.row')
  //         .eq(-2)
  //         .trigger('click')
  //         .wait(1000)
  //         .then(row => expect(row.hasClass('active')).to.be.true)
  //         .wait(500)
  //         .then(() => {
  //           store.select('mempool').subscribe(mempool => {
  //             expect(mempool.statisticsState.activeOperation.hash).to.equal(mempool.statisticsState.operations[mempool.statisticsState.operations.length - 2]);
  //           });
  //         });
  //     });
  // });
});
