context('BAKING REWARDS', () => {

  it('[BAKING REWARDS] should send batch transactions', () => {
    localStorage.setItem('sidenavCollapsed', 'true');
    cy.intercept('/chains/main/blocks/head~2/metadata', { fixture: 'baking/metadata.json' }).as('getMetadata');
    cy.intercept('/dev/rewards/cycle/169', { fixture: 'baking/bakers.json' }).as('getBakers');
    cy.intercept('/dev/rewards/cycle/169/*', { fixture: 'baking/delegators.json' }).as('getDelegators');
    cy.visit(Cypress.config().baseUrl + '/#/baking', { timeout: 100000 });

    let clicked = false;
    let angular;
    cy.window()
      .then((win) => {
        angular = win.ng;
      })
      .its('store')
      .then(store => {
        store.select('baking').subscribe(baking => {
          if (baking.bakers.length && !clicked) {
            clicked = true;
            const baker = baking.bakers[0];
            cy.get('app-baking-delegates-table cdk-virtual-scroll-viewport')
              .find('.row')
              .wait(1000)
              .eq(0)
              .trigger('click')
              .url()
              .should('include', '/baking/' + baker.hash)
              .get('app-baking-delegators-table .overflow-auto')
              .scrollTo('right')
              .get('.row.head span:nth-child(6)')
              .click()
              .wait(2000)
              .get('app-baking-summary .summary-box .custom-bottom-form-field input')
              .eq(0)
              .clear()
              .type('10', { force: true })
              .blur()
              .wait(4000)
              .get('app-baking-summary form button.blue-btn')
              .trigger('click')
              .wait(2000)
              .then(() => cy.document())
              .then((doc) => {
                const componentInstance = angular
                  .getComponent(doc.querySelector('ng-component'));

                cy.stub(componentInstance, 'getLedgerAddress', () => {
                  componentInstance.ledger = {
                    publicKey: 'edpkvZCHFVcXpBTVpD3ZANuZ7mPTfs62TUzcmpjTr1ZYhwaZdf3fer',
                    publicKeyHash: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
                  };
                });
              })
              .get('body .cdk-overlay-container mat-dialog-container mat-stepper #cdk-step-content-0-0 button.blue-btn')
              .trigger('click')
              .wait(2000)
              .intercept('/tables/op?columns=status,hash,sender,receiver&type=transaction&cycle=170&limit=50000', { fixture: 'baking/tzstatsNonMatchingResponse.json' })
              .as('getTzStatsNonMatchingOperations')
              .get('body .cdk-overlay-container mat-dialog-container mat-stepper #cdk-step-content-0-1 button.blue-btn')
              .trigger('click')
              .wait(5000)
              .intercept('/tables/op?columns=status,hash,sender,receiver&type=transaction&cycle=170&limit=50000', { fixture: 'baking/tzstatsOperationsTable.json' })
              .as('getTzStatsOperations')
              .get('app-baking-batch-list cdk-virtual-scroll-viewport .batch:nth-child(1) button')
              .click({ scrollBehavior: false })
              .wait(5000)
              .get('body .cdk-overlay-container mat-dialog-container button.blue-btn')
              .trigger('click')
              .get('app-baking-delegators-table cdk-virtual-scroll-viewport .row span:last-child mat-icon.icon-light-green', { timeout: 20000 })
              .then(el => {
                expect(el.length).to.be.greaterThan(0);
              })
              .get('app-baking-batch-list cdk-virtual-scroll-viewport .batch:nth-child(1) .link')
              .then(el => expect(el.text()).to.includes('View in TzStats'))
              .get('app-baking-batch-list cdk-virtual-scroll-viewport .batch:nth-child(1) div.flex-row div.flex-row:nth-child(2)')
              .then(el => expect(el.text()).to.includes('Distributed'))
              .wait(2000);
          }
        });
      });

  });

});
