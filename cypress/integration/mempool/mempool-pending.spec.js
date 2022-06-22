import { testForTezedge } from '../../support';

const beforePendingTest = (test) => {
  let tested = false;
  cy.visit(Cypress.config().baseUrl + '/#/mempool/pending', { timeout: 100000 })
    .wait(1000)
    .window()
    .its('store')
    .then({ timeout: 5500 }, store => {
      return new Cypress.Promise((resolve) => {
        setTimeout(() => resolve(), 5000);
        store.select('mempool').subscribe(mempool => {
          if (!tested && mempool.operationState.mempoolOperations.length) {
            tested = true;
            testForTezedge(test);
            resolve();
          }
        });
      });
    });
};

context('MEMPOOL PENDING', () => {
  it('[MEMPOOL PENDING] should have status code 200 for get mempool operations request', () => beforePendingTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          cy.request(settingsNode.activeNode.http + '/chains/main/mempool/pending_operations')
            .its('status')
            .should('eq', 200);
        });
      });
  }));

  it('[MEMPOOL PENDING] should create rows for the virtual scroll table', () => beforePendingTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.operationState.mempoolOperations.length) {
            cy.get('app-mempool-operation cdk-virtual-scroll-viewport .row')
              .should('be.visible');
          }
        });
      });
  }));

  it('[MEMPOOL PENDING] should fill the last row of the table with the last value received', () => beforePendingTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.operationState.mempoolOperations.length) {
            const lastRecord = mempool.operationState.mempoolOperations[mempool.operationState.mempoolOperations.length - 1];
            cy.get('cdk-virtual-scroll-viewport')
              .scrollTo('bottom')
              .wait(1000)
              .find('.row')
              .last()
              .find('span:first-child')
              .should(span => {
                expect(span.text().trim()).to.equal(lastRecord.hash);
              });
          }
        });
      });
  }));

  it('[MEMPOOL PENDING] should fill the right details part with the message of the clicked row', () => beforePendingTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe((mempool) => {
          if (mempool.operationState.mempoolOperations.length > 1) {
            cy.get('cdk-virtual-scroll-viewport')
              .wait(1000)
              .find('.row')
              .eq(1)
              .trigger('click')
              .wait(1000)
              .then(row => expect(row.hasClass('active')).to.be.true)
              .get('.ngx-json-viewer').should('be.visible');
          }
        });
      });
  }));

  it('[MEMPOOL PENDING] should fill the right details part with the message of the hovered row - the second last record in our case', () => beforePendingTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe((mempool) => {
          if (mempool.operationState.mempoolOperations.length) {
            cy.get('cdk-virtual-scroll-viewport')
              .scrollTo('bottom')
              .wait(1000)
              .find('.row')
              .eq(-2)
              .trigger('mouseenter')
              .wait(1000)
              .get('.ngx-json-viewer').should('be.visible');
          }
        });
      });
  }));

  it('[MEMPOOL PENDING] should auto select first row on load', () => beforePendingTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.operationState.mempoolOperations.length) {
            cy.get('cdk-virtual-scroll-viewport')
              .find('.row')
              .first()
              .then(row => expect(row.hasClass('active')).to.be.true)
              .get('cdk-virtual-scroll-viewport .row:first-child span:first-child')
              .should(span => {
                expect(span.text().trim()).to.equal(mempool.operationState.mempoolOperations[0].hash);
              });
          }
        });
      });
  }));

});
