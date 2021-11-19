import { testForTezedge } from '../../../support';

context('NETWORK', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v2/p2p?node_name=*').as('getNetworkRequest')
      .visit(Cypress.config().baseUrl + '/#/network', { timeout: 30000 })
      .wait('@getNetworkRequest', { timeout: 30000 })
      .wait(300);
  });

  it('[NETWORK] should have status code 200 for get network request', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          cy.request(settingsNode.activeNode.features.find(f => f.name === 'debugger').url + '/v2/p2p?limit=100&node_name=' + settingsNode.activeNode.p2p_port)
            .its('status')
            .should('eq', 200);
        });
      });
  });

  it('[NETWORK] should create rows for the virtual scroll table', () => {
    cy.get('.virtual-scroll-container')
      .find('.virtualScrollRow')
      .should('be.visible');
  });

  it('[NETWORK] should change the value of the virtual scroll element when scrolling', () => {
    cy.get('.stop-stream').click()
      .wait(500)
      .window()
      .its('store')
      .then((store) => {
        store.select('networkAction').subscribe(network => {
          expect(network.stream).to.be.false;
          let beforeScrollValue;
          cy.get('.virtual-scroll-container .virtualScrollRow.used')
            .last()
            .find('.date-time')
            .then(($span) => {
              beforeScrollValue = $span.text().trim();
            })
            .wait(500)
            .get('.virtual-scroll-container')
            .scrollTo('top')

            .get('.virtual-scroll-container .virtualScrollRow.used')
            .last()
            .find('.date-time')
            .should(($span) => {
              expect($span.text()).to.not.equal(beforeScrollValue);
            });
        });
      });
  });

  it('[NETWORK] should fill the last row of the table with the last value received', () => {
    cy.get('.stop-stream').click()
      .wait(500)
      .window()
      .its('store')
      .then(store => {
        store.select('networkAction').subscribe(network => {
          const lastRecord = network.entities[network.ids[network.ids.length - 1]];
          cy.get('.virtual-scroll-container .virtualScrollRow.used')
            .last()
            .find('.network-action-table-address')
            .should(span => {
              expect(span.text().trim()).to.equal(lastRecord.remote_addr);
            });
        });
      });
  });

  it('[NETWORK] should filter results by operation', () => {
    cy.get('.stop-stream').click()
      .get('app-network-action .mat-expansion-panel-body .filters-row:last-child button')
      .then(buttons => {
        if (buttons) {
          const operationBtn = Array.from(buttons).find(btn => btn.textContent === ' Operation ');
          operationBtn.click();
        }
      })
      .wait(3000)
      .window()
      .its('store')
      .then(store => {
        store.select('networkAction').subscribe(network => {
          const values = Object.keys(network.entities).map(key => network.entities[key]);
          const areAllOperations = values.every(v => v.kind === 'operation' || v.kind === 'get_operations');
          expect(areAllOperations).to.be.true;
        });
      });
  });

  it('[NETWORK] should filter results by connection', () => {
    cy.get('.stop-stream').click()
      .get('app-network-action .mat-expansion-panel-body .filters-row:first-child button')
      .then(buttons => {
        if (buttons) {
          const operationBtn = Array.from(buttons).find(btn => btn.textContent === ' Connection ');
          operationBtn.click();
        }
      })
      .wait(3000)
      .window()
      .its('store')
      .then(store => {
        store.select('networkAction').subscribe(network => {
          const values = Object.keys(network.entities).map(key => network.entities[key]);
          const areAllOperations = values.every(v => v.category === 'connection');
          expect(areAllOperations).to.be.true;
        });
      });
  });

  it('[NETWORK] should filter results by source type', () => {
    cy.get('.stop-stream').click()
      .get('app-network-action .mat-expansion-panel-body .filters-row:first-child button')
      .then(buttons => {
        if (buttons) {
          const operationBtn = Array.from(buttons).find(btn => btn.textContent.includes('Local '));
          operationBtn.click();
        }
      })
      .wait(3000)
      .window()
      .its('store')
      .then(store => {
        store.select('networkAction').subscribe(network => {
          const values = Object.keys(network.entities).map(key => network.entities[key]);
          const areAllOperations = values.every(v => v.source_type === 'local');
          expect(areAllOperations).to.be.true;
        });
      });
  });

  it('[NETWORK] should fill the right details part with the message of the clicked row - the second last record in our case', () => testForTezedge(() => {
    cy.get('.stop-stream').click()
      .window()
      .its('store')
      .then(store => {
        store.select('networkAction').subscribe(() => {
          cy.get('.virtual-scroll-container .virtualScrollRow.used')
            .eq(-2)
            .trigger('click')
            .wait(1000)
            .get('.ngx-json-viewer').should('be.visible');
        });
      });
  }));

  it('[NETWORK] should jump to the first page', () => {
    cy.get('.stop-stream').click()
      .wait(300)
      .get('#firstPage').click()
      .wait(1000)
      .window()
      .its('store')
      .then(store => {
        store.select('networkAction').subscribe(network => {
          cy.wrap(network.entities[network.ids[0]].originalId).should('eq', 0)
            .get('#firstPage').should('be.disabled')
            .get('#previousPage').should('be.disabled');
        });
      });
  });

  it('[NETWORK] should jump to the last page', () => {
    cy.get('.stop-stream').click()
      .wait(300)
      .get('#previousPage').click()
      .wait(1500)
      .get('#previousPage').click()
      .wait(1500)
      .get('#lastPage').click()
      .wait(4000)
      .window()
      .its('store')
      .then(store => {
        store.select('networkAction').subscribe(network => {
          cy.get('#lastPage').should('be.disabled')
            .get('#nextPage').should('be.disabled');
          expect(network.activePage.id).to.equal(network.pages[network.pages.length - 1]);
        });
      });
  });

  it('[NETWORK] should search network by time', () => {
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

          cy.get('.custom-bottom-form-field input').type(inputValue)
            .wait(1000)
            .window()
            .its('store')
            .then((store) => {
              store.select('networkAction').subscribe((logs) => {
                expect(logs.stream).to.be.false;
                expect(logs.timestamp).to.not.be.undefined;
              });
            });
        }
      });
  });
});
