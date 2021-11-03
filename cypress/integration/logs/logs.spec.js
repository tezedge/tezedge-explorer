context('LOGS', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v2/log?*').as('getLogRequest')
      .visit(Cypress.config().baseUrl + '/#/logs', { timeout: 20000 })
      .wait('@getLogRequest', { timeout: 30000 })
      .wait(300);
  });

  it('[LOGS] should have status code 200 for get logs request', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          cy.request(settingsNode.activeNode.features.find(f => f.name === 'debugger').url + '/v2/log?limit=100&node_name=' + settingsNode.activeNode.p2p_port)
            .its('status')
            .should('eq', 200);
        });
      });
  });

  it('[LOGS] create rows for the virtual scroll table', () => {
    cy.get('.virtual-scroll-container')
      .find('.virtualScrollRow');
  });

  it('[LOGS] should fill the last row of the table with the last value received', () => {
    cy.get('.stop-stream').click()
      .wait(500)
      .window()
      .its('store')
      .then((store) => {
        store.select('logsAction')
          .subscribe((data) => {
            const lastRecord = data.entities[data.ids[data.ids.length - 1]];

            cy.get('.virtual-scroll-container .virtualScrollRow.used')
              .last()
              .find('.log-message')
              .then($span => {
                expect($span.text().trim()).to.equal(lastRecord.message);
              });
          });
      });
  });

  it('[LOGS] should initially select the last record and fill the right details part with its message', () => {
    cy.get('.stop-stream').click()
      .wait(500)
      .window()
      .its('store')
      .then((store) => {
        store.select('logsAction').subscribe((data) => {
          const lastRecord = data.entities[data.ids[data.ids.length - 1]];

          cy.get('#virtualScrollTableDetails .non-json-container').should('contain', lastRecord.message);
        });
      });
  });

  it('[LOGS] should fill the right details part with the message of the clicked row - the second last record in our case', () => {
    cy.get('.stop-stream').click()
      .wait(500)

      .window()
      .its('store')
      .then((store) => {
        store.select('logsAction').subscribe((logsAction) => {
          const secondLastRecord = logsAction.entities[logsAction.ids[logsAction.ids.length - 2]];

          cy.get('.virtual-scroll-container .virtualScrollRow.used')
            .eq(-2)
            .trigger('click')
            .wait(1000)

            .get('#virtualScrollTableDetails .non-json-container')
            .should('contain', secondLastRecord.message);
        });
      });
  });

  it('[LOGS] should change the value of the virtual scroll element when scrolling', () => {
    let beforeScrollValue;
    cy.get('.stop-stream').click()
      .wait(500)
      .window()
      .its('store')
      .then((store) => {
        store.select('logsAction').subscribe(() => {
          cy.get('.virtual-scroll-container .virtualScrollRow.used')
            .last()
            .find('.log-message')
            .then(($span) => {
              beforeScrollValue = $span.text();
            })

            .get('.virtual-scroll-container')
            .scrollTo('top')

            .get('.virtual-scroll-container .virtualScrollRow.used')
            .find('.log-message')
            .then($span => {
              expect($span.text()).to.not.equal(beforeScrollValue);
            });
        });
      });
  });

  it('[LOGS] should jump to the first page', () => {
    cy.get('.stop-stream')
      .click()
      .wait(300)
      .get('#firstPage')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then((store) => {
        store.select('logsAction').subscribe((data) => {
          expect(data.entities[data.ids[0]].originalId).to.equal(0);
          cy.get('#firstPage').should('be.disabled')
            .get('#previousPage').should('be.disabled');
        });
      });
  });

  it('[LOGS] should jump to the last page', () => {
    cy.get('.stop-stream').click()
      .wait(300)
      .get('#previousPage').click()
      .wait(600)
      .get('#previousPage').click()
      .wait(1000)
      .get('#lastPage').click()
      .wait(2000)
      .window()
      .its('store')
      .then((store) => {
        store.select('logsAction').subscribe((data) => {
          if (!data.stream) {
            expect(data.activePage.id).to.equal(data.pages[data.pages.length - 1]);
            cy.get('#lastPage').should('be.disabled')
              .get('#nextPage').should('be.disabled');
          }
        });
      });
  });

  it('[LOGS] should search logs by time', () => {
    let placeholder;
    cy.get('.custom-bottom-form-field input')
      .invoke('attr', 'placeholder')
      .then(value => {
        placeholder = value.replace('e.g: ', '');
      })
      .wait(1000)
      .then(() => {

        const minutes = placeholder.slice(3, 5);
        const twoDigit = (val) => val < 10 ? `0${val}` : val;

        if (Number(minutes) > 1) {
          const inputValue = placeholder.replace(':' + minutes + ':', ':' + twoDigit(Number(minutes) - 1) + ':');

          cy.get('.custom-bottom-form-field input')
            .type(inputValue)
            .wait(1000)
            .window()
            .its('store')
            .then((store) => {
              store.select('logsAction').subscribe((logs) => {
                expect(logs.stream).to.be.false;
                expect(logs.timestamp).not.to.be.undefined;

                let rowMessage;
                cy.get('.virtual-scroll-container .virtualScrollRow.used.hover .log-message')
                  .then(value => {
                    rowMessage = value.text();
                  })
                  .get('#virtualScrollTableDetails .non-json-container')
                  .then(value => {
                    expect(rowMessage).to.equal(value.text());
                  });
              });
            });
        }
      });
  });

  it('[LOGS] should search logs by text', () => {
    const textToSearch = 'peer';
    cy.get('.stop-stream')
      .click()
      .wait(500)
      .get('.virtual-scroll-container .virtualScrollRow.used', { timeout: 20000 })
      .get('.search-div input.search-box').type(textToSearch, { force: true })
      .get('.search-div input.search-box').type('{enter}', { force: true })
      .wait(3000)
      .window()
      .its('store')
      .then((store) => {
        store.select('logsAction').subscribe((data) => {
          const allContainSearchedString = Object.keys(data.entities).map(key => data.entities[key])
            .every(entry => entry.message.toLowerCase().includes(textToSearch)) || true;
          expect(allContainSearchedString).to.equal(true);
        });
      });
  });
});
