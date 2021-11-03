context('MEMPOOL OPERATION', () => {
  beforeEach(() => {
    cy.intercept('GET', '/chains/main/mempool/pending_operations').as('getMempoolOperations')
      .visit(Cypress.config().baseUrl + '/#/mempool/operations', { timeout: 30000 })
      .wait('@getMempoolOperations', { timeout: 100000 })
      .wait(500);
  });

  it('[MEMPOOL OPERATION] should have status code 200 for get mempool operations request', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          cy.request(settingsNode.activeNode.http + '/chains/main/mempool/pending_operations')
            .its('status')
            .should('eq', 200);
        });
      });
  });

  it('[MEMPOOL OPERATION] should create rows for the virtual scroll table', () => {
    cy.get('cdk-virtual-scroll-viewport')
      .find('.mempool-row')
      .should('be.visible');
  });

  it('[MEMPOOL OPERATION] should change the value of the virtual scroll element when scrolling', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(() => {
          let beforeScrollValue;
          cy.get('cdk-virtual-scroll-viewport .mempool-row')
            .last()
            .find('span:first-child')
            .then(span => {
              beforeScrollValue = span.text().trim();
            })
            .wait(2000)
            .get('cdk-virtual-scroll-viewport')
            .scrollTo('bottom')
            .wait(1000)
            .get('cdk-virtual-scroll-viewport .mempool-row')
            .last()
            .find('span:first-child')
            .should(span => {
              expect(span.text().trim()).to.not.equal(beforeScrollValue);
            });
        });
      });
  });

  it('[MEMPOOL OPERATION] should fill the last row of the table with the last value received', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.operationState.mempoolOperations.length) {
            const lastRecord = mempool.operationState.mempoolOperations[mempool.operationState.mempoolOperations.length - 1];
            cy.get('cdk-virtual-scroll-viewport')
              .scrollTo('bottom')
              .wait(1000)
              .find('.mempool-row')
              .last()
              .find('span:first-child')
              .should(span => {
                expect(span.text().trim()).to.equal(lastRecord.hash);
              });
          }
        });
      });
  });

  it('[MEMPOOL OPERATION] should fill the right details part with the message of the clicked row - the second last record in our case', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(() => {
          cy.get('cdk-virtual-scroll-viewport')
            .scrollTo('bottom')
            .wait(1000)
            .find('.mempool-row')
            .eq(-2)
            .trigger('click')
            .wait(1000)
            .then(row => expect(row.hasClass('active')).to.be.true)
            .get('.ngx-json-viewer').should('be.visible');
        });
      });
  });

  it('[MEMPOOL OPERATION] should fill the right details part with the message of the hovered row - the second last record in our case', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(() => {
          cy.get('cdk-virtual-scroll-viewport')
            .scrollTo('bottom')
            .wait(1000)
            .find('.mempool-row')
            .eq(-2)
            .trigger('mouseenter')
            .wait(1000)
            .get('.ngx-json-viewer').should('be.visible');
        });
      });
  });

  it('[MEMPOOL OPERATION] should auto select first row on load', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          cy.get('cdk-virtual-scroll-viewport')
            .find('.mempool-row')
            .first()
            .then(row => expect(row.hasClass('active')).to.be.true)
            .get('cdk-virtual-scroll-viewport .mempool-row:first-child span:first-child')
            .should(span => {
              expect(span.text().trim()).to.equal(mempool.operationState.mempoolOperations[0].hash);
            });
        });
      });
  });

});
