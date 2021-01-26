context('logs', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
    cy.wait(1000);
    cy.visit(Cypress.config().baseUrl + '/#/logs', {timeout: 10000});
    cy.wait(1000);
  })

  it('[logs] perform logs request successfully', () => {
    cy.intercept('GET', '/v2/log/*').as('getLogRequest');
    cy.wait('@getLogRequest').its('response.statusCode').should('eq', 200);
  })

  it('[logs] create rows for the virtual scroll table', () => {
    cy.get('.virtual-scroll-container')
      .find('.virtualScrollRow');
  })

  it('[logs] fill the last row of the table with the last value received', () => {
    cy.wait(1000)
      .then(() => {
        cy.get('#stopStreaming').click();

        cy.window()
          .its('store')
          .then((store) => {
            store.select('logsAction')
              .subscribe((data) => {
                const lastRecord = data.entities[data.ids[data.ids.length - 1]];

                cy.get('.virtual-scroll-container .virtualScrollRow.used')
                  .last()
                  .find('.log-message')
                  .should(($span) => {
                    expect($span.text().trim()).to.equal(lastRecord.message);
                  })
              })

          })
      })

  })

  it('[logs] initially select the last record and fill the right details part with its message', () => {
    cy.wait(1000)
      .then(() => {
        cy.get('#stopStreaming').click();

        cy.window()
          .its('store')
          .then((store) => {
            store.select('logsAction')
              .subscribe((data) => {
                console.log(data);
                const lastRecord = data.entities[data.ids[data.ids.length - 1]];

                cy.get('#virtualScrollTableDetails .ngx-json-viewer')
                  .contains(lastRecord.message);
              })

          })
      })

  })

  it('[logs] fill the right details part with the message of the hovered row - the second last record in our case', () => {
    cy.wait(1000)
      .then(() => {
        cy.get('#stopStreaming').click();

        cy.window()
          .its('store')
          .then((store) => {
            store.select('logsAction')
              .subscribe((data) => {
                console.log(data);
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

  // it('[logs] change the value of the virtual scroll element when scrolling', () => {
  //   let beforeScrollValue;
  //
  //   cy.wait(1000)
  //     .then(() => {
  //       cy.get('#stopStreaming').click();
  //       cy.wait(500);
  //
  //       cy.get('.virtual-scroll-container .virtualScrollRow.used')
  //         .last()
  //         .find('.log-message')
  //         .then(($span) => {
  //           beforeScrollValue = $span.text();
  //         });
  //
  //       cy.wait(500);
  //
  //       cy.get('.virtual-scroll-container').scrollTo('top');
  //
  //       cy.get('.virtual-scroll-container .virtualScrollRow.used')
  //         .last()
  //         .find('.log-message')
  //         .should(($span) => {
  //           expect($span.text()).to.not.equal(beforeScrollValue);
  //         });
  //     })
  //
  // })
})
