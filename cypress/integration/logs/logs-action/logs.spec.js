context('logs', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
    cy.wait(1000);
    cy.visit(Cypress.config().baseUrl + '/#/logs', { timeout: 10000 });
    cy.wait(1000);
  })

  it('[logs] perform logs request successfully', () => {
    cy.intercept('GET', '/v2/log?*').as('getLogRequest');
    cy.wait('@getLogRequest').its('response.statusCode').should('eq', 200);
  })

  it('[logs] create rows for the virtual scroll table', () => {
    cy.get('.virtual-scroll-container')
      .find('.virtualScrollRow');
  })

  it('[logs] fill the last row of the table with the last value received', () => {
    cy.wait(1000)
      .then(() => {
        cy.get('.stop-stream').click();

        cy.window()
          .its('store')
          .then((store) => {
            store.select('logsAction')
              .subscribe((data) => {
                if (!data.stream) {
                  const lastRecord = data.entities[data.ids[data.ids.length - 1]];

                  cy.get('.virtual-scroll-container .virtualScrollRow.used')
                    .last()
                    .find('.log-message')
                    .should(($span) => {
                      expect($span.text().trim()).to.equal(lastRecord.message);
                    })
                } else {
                  cy.get('.stop-stream').click();
                }
              })
          })
      })
  })

  it('[logs] initially select the last record and fill the right details part with its message', () => {
    cy.wait(1000)
      .then(() => {
        cy.get('.stop-stream').click();

        cy.window()
          .its('store')
          .then((store) => {
            store.select('logsAction')
              .subscribe((data) => {
                if (!data.stream) {
                  const lastRecord = data.entities[data.ids[data.ids.length - 1]];

                  cy.get('#virtualScrollTableDetails .non-json-container')
                    .contains(lastRecord.message);
                } else {
                  cy.get('.stop-stream').click();
                }
              })
          })
      })
  })

  it('[logs] fill the right details part with the message of the clicked row - the second last record in our case', () => {
    cy.wait(1000)
      .then(() => {
        cy.get('.stop-stream').click();

        cy.window()
          .its('store')
          .then((store) => {
            store.select('logsAction')
              .subscribe((data) => {
                if (!data.stream) {
                  const secondLastRecord = data.entities[data.ids[data.ids.length - 2]];

                  cy.get('.virtual-scroll-container .virtualScrollRow.used')
                    .eq(-2)
                    .trigger('click');

                  cy.get('#virtualScrollTableDetails .non-json-container')
                    .contains(secondLastRecord.message);
                } else {
                  cy.get('.stop-stream').click();
                }
              })
          })
      })
  })

  it('[logs] change the value of the virtual scroll element when scrolling', () => {
    let beforeScrollValue;

    cy.wait(1000)
      .then(() => {
        cy.get('.stop-stream').click();

        cy.window()
          .its('store')
          .then((store) => {
            store.select('logsAction')
              .subscribe((data) => {
                if (!data.stream) {
                  cy.get('.virtual-scroll-container .virtualScrollRow.used')
                    .last()
                    .find('.log-message')
                    .then(($span) => {
                      beforeScrollValue = $span.text();
                    });

                  cy.get('.virtual-scroll-container').scrollTo('top');

                  cy.get('.virtual-scroll-container .virtualScrollRow.used')
                    .last()
                    .find('.log-message')
                    .should(($span) => {
                      expect($span.text()).to.not.equal(beforeScrollValue);
                    });
                } else {
                  cy.get('.stop-stream').click();
                }
              })
          })
      })
  })
})
