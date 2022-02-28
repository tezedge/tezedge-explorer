import { beforeEachForTezedge, testForTezedge } from '../../support';

context('SMART CONTRACTS', () => {
  beforeEach(() => {
    beforeEachForTezedge(() => {
      cy.visit(Cypress.config().baseUrl + '/#/contracts', { timeout: 100000 })
        .wait(1000);
    });
  });

  it('[SMART CONTRACTS] should have status code 200 for get block details', () => testForTezedge(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          cy.request(settingsNode.activeNode.http + '/chains/main/blocks/head')
            .its('status')
            .should('eq', 200);
        });
      });
  }));

  it('[SMART CONTRACTS] should create rows for the cdk virtual scroll table', () => testForTezedge(() => {
    cy.get('app-smart-contracts app-smart-contracts-table .row.head').should('be.visible')
      .window()
      .its('store')
      .then(store => {
        store.select('smartContracts').subscribe(smartContracts => {
          if (smartContracts.contracts.length > 0) {
            cy.get('app-smart-contracts app-smart-contracts-table cdk-virtual-scroll-viewport .row', { timeout: 400000 }).should('be.visible');
          }
        });
      });
  }));

  it('[SMART CONTRACTS] should select smart contract on click', () => testForTezedge(() => {
    cy.get('app-smart-contracts app-smart-contracts-table cdk-virtual-scroll-viewport .row', { timeout: 400000 })
      .should('be.visible')
      .window()
      .its('store')
      .then(store => {
        store.select('smartContracts').subscribe(smartContracts => {
          if (smartContracts.contracts.length > 0) {
            cy.get('app-smart-contracts app-smart-contracts-table cdk-virtual-scroll-viewport .row', { timeout: 10000 })
              .eq(1)
              .click();
          }
          if (smartContracts.activeContract) {
            expect(smartContracts.activeContract).to.eq(smartContracts.contracts[1]);
          }
        });
      });
  }));

});
