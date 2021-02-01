context('network', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
    cy.wait(1000);
    cy.visit(Cypress.config().baseUrl + '/#/network', {timeout: 10000});
    cy.wait(1000);
  })

  it('[network] perform network request successfully', () => {
    cy.intercept('GET', '/v2/p2p/*').as('getNetworkRequest');
    cy.wait('@getNetworkRequest').its('response.statusCode').should('eq', 200);
  })

  it('[network] create rows for the virtual scroll table', () => {
    cy.get('.virtual-scroll-container')
      .find('.virtualScrollRow');
  })

  it('[network] fill the last row of the table with the last value received', () => {
    cy.wait(1000)
      .then(() => {
        cy.get('#stopStreaming').click();

        cy.window()
          .its('store')
          .then((store) => {
            store.select('networkAction')
              .subscribe((data) => {
                if (!data.stream) {
                  const lastRecord = data.entities[data.ids[data.ids.length - 1]];

                  cy.get('.virtual-scroll-container .virtualScrollRow.used')
                    .last()
                    .find('.network-action-table-address a')
                    .should(($a) => {
                      expect($a.text().trim()).to.equal(lastRecord.remote_addr);
                    })
                } else {
                  cy.get('#stopStreaming').click();
                }
              })

          })
      })

  })

  /*
  it('[network] initially select the last record and fill the right details part with its message', () => {
    cy.wait(1000)
      .then(() => {
        cy.get('#stopStreaming').click();

        cy.window()
          .its('store')
          .then((store) => {
            store.select('networkAction')
              .subscribe((data) => {
                console.log(data);
                const lastRecord = data.entities[data.ids[data.ids.length - 1]];

                cy.get('#virtualScrollTableDetails .ngx-json-viewer')
                  .contains(lastRecord.message);
              })

          })
      })

  })

  it('[network] fill the right details part with the message of the hovered row - the second last record in our case', () => {
    cy.wait(1000)
      .then(() => {
        cy.get('#stopStreaming').click();

        cy.window()
          .its('store')
          .then((store) => {
            store.select('networkAction')
              .subscribe((data) => {
                const secondLastRecord = data.entities[data.ids[data.ids.length - 2]];

                cy.get('.virtual-scroll-container .virtualScrollRow.used')
                  .eq(-2)
                  .trigger('mouseenter');

                cy.get('#virtualScrollTableDetails .ngx-json-viewer')
                  .contains(secondLastRecord.message);
              })

          })
      })

  })

  it('[network] change the value of the virtual scroll element when scrolling', () => {
    let beforeScrollValue;

    cy.wait(1000)
      .then(() => {
        cy.get('#stopStreaming').click();

        cy.window()
          .its('store')
          .then((store) => {
            store.select('networkAction')
              .subscribe((data) => {
                if (!data.stream) {
                  cy.get('.virtual-scroll-container .virtualScrollRow.used')
                    .last()
                    .find('.network-action-table-address a')
                    .then(($a) => {
                      beforeScrollValue = $a.text().trim();
                    });

                  cy.wait(500);
                  cy.get('.virtual-scroll-container').scrollTo('top');

                  cy.get('.virtual-scroll-container .virtualScrollRow.used')
                    .last()
                    .find('.network-action-table-address a')
                    .should(($a) => {
                      expect($a.text()).to.not.equal(beforeScrollValue);
                    });
                } else {
                  cy.get('#stopStreaming').click();
                }
              })

          })
      })

  })
*/
})
