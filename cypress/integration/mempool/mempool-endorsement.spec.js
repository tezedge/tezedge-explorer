import { testForTezedge } from '../../support';

const beforeEndorsementTest = (test) => {
  let tested = false;
  cy.visit(Cypress.config().baseUrl + '/#/mempool/consensus/endorsements', { timeout: 100000 })
    .window()
    .its('store')
    .then({ timeout: 10500 }, store => {
      return new Cypress.Promise((resolve) => {
        setTimeout(() => resolve(), 10000);
        store.select('mempool').subscribe(mempool => {
          if (!tested && mempool.endorsementState.endorsements.length > 0) {
            tested = true;
            testForTezedge(test);
            resolve();
          }
        });
      });
    });
};

context('MEMPOOL ENDORSEMENT', () => {

  it('[MEMPOOL ENDORSEMENT] should have status code 200 for get mempool operations request', () => beforeEndorsementTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          store.select(state => state.monitoring.networkStats).subscribe(networkStats => {
            const level = networkStats.lastAppliedBlock.level;
            if (!!level) {
              cy.request(`${settingsNode.activeNode.http}/chains/main/blocks/head/helpers/validators?level=${level}`)
                .its('status')
                .should('eq', 200);
            }
          });
        });
      });
  }));

  it('[MEMPOOL ENDORSEMENT] should create rows for the virtual scroll table', () => beforeEndorsementTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.endorsementState.endorsements.length > 0) {
            cy.get('app-endorsement .table-container .row')
              .should('be.visible');
          }
        });
      });
  }));

  it('[MEMPOOL ENDORSEMENT] should display correct color based on status', () => beforeEndorsementTest(() => {
    let oneStrike = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.endorsementState.endorsements.length > 0) {
            if (!oneStrike) {
              oneStrike = true;
              const endorsements = mempool.endorsementState.endorsements;
              endorsements.forEach((endorsement, index) => {
                if (index < 11) {
                  cy.get('.row:nth-child(' + (index + 1) + ')')
                    .find('.status')
                    .should('have.class', endorsement.status || 'missing', { timeout: 0 });
                }
              });
            }
          }
        });
      });
  }));

  it('[MEMPOOL ENDORSEMENT] should show red text for big values for receive hash time column', () => beforeEndorsementTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.endorsementState.endorsements.length > 0) {
            if (mempool.endorsementState.endorsements[0].receiveHashTime > 50000000) {
              cy.get('.row:not(.head):first-child span:nth-child(5) span.text-red')
                .should('be.visible');
            }
          }
        });
      });
  }));

  it('[MEMPOOL ENDORSEMENT] should show yellow text for big values for receive hash time column', () => beforeEndorsementTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.endorsementState.endorsements.length > 0) {
            const index = mempool.endorsementState.endorsements.findIndex(e => e.receiveHashTime > 20000000 && e.receiveHashTime < 50000000);
            if (index !== -1) {
              cy.get('.row:not(.head):nth-child(' + (index + 1) + ') span:nth-child(5) span.text-yellow')
                .should('be.visible');
            }
          }
        });
      });
  }));

  it('[MEMPOOL ENDORSEMENT] should sort column by decode delta', () => beforeEndorsementTest(() => {
    let sorted = false;
    let checked = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          const mempoolEndorsements = mempool.endorsementState.endorsements;
          if (mempoolEndorsements.length > 0) {
            if (!sorted) {
              cy.get('.row.head span:nth-child(7)')
                .click()
                .wait(500)
                .get('.row.head span:nth-child(7) mat-icon.show')
                .should('be.visible')
                .then(() => sorted = true)
                .window()
                .its('store')
                .then(store => {
                  store.select('mempool').subscribe(mempool => {
                    const sortedEndorsements = mempool.endorsementState.endorsements;
                    if (sorted && !checked) {
                      checked = true;
                      sortedEndorsements.forEach((e, i) => {
                        if (sortedEndorsements[i + 1] !== undefined) {
                          const first = sortedEndorsements[i].decodeTimeDelta;
                          const second = sortedEndorsements[i + 1].decodeTimeDelta;
                          if (!isNaN(first) && !isNaN(second)) {
                            expect(first >= second).to.be.true;
                          }
                        }
                      });
                    }
                  });
                });
            }
          }
        });
      });
  }));

  it('[MEMPOOL ENDORSEMENT] should sort column by decode', () => beforeEndorsementTest(() => {
    let sorted = false;
    let checked = false;
    cy.get('app-endorsement mat-checkbox')
      .click()
      .wait(500)
      .window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          const mempoolEndorsements = mempool.endorsementState.endorsements;
          if (mempoolEndorsements.length > 0) {
            if (!sorted) {
              cy.get('.row.head span:nth-child(7)')
                .click()
                .wait(500)
                .get('.row.head span:nth-child(7) mat-icon.show')
                .should('be.visible')
                .then(() => sorted = true)
                .window()
                .its('store')
                .then(store => {
                  store.select('mempool').subscribe(mempool => {
                    const sortedEndorsements = mempool.endorsementState.endorsements;
                    if (sorted && !checked) {
                      checked = true;
                      sortedEndorsements.forEach((e, i) => {
                        if (sortedEndorsements[i + 1] !== undefined) {
                          const first = sortedEndorsements[i].decodeTime;
                          const second = sortedEndorsements[i + 1].decodeTime;
                          if (!isNaN(first) && !isNaN(second)) {
                            expect(first >= second).to.be.true;
                          }
                        }
                      });
                    }
                  });
                });
            }
          }
        });
      });
  }));

  it('[MEMPOOL ENDORSEMENT] should move searched baker at the top of the table', () => beforeEndorsementTest(() => {
    let haveValue;
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.endorsementState.endorsements.length > 9) {
            const tenthEndorsement = mempool.endorsementState.endorsements[9];
            if (!haveValue) {
              haveValue = true;
              cy.get('app-endorsement .table-container .row:nth-child(10) span:nth-child(2) span')
                .should(span => {
                  expect(span.text().trim()).to.equal(tenthEndorsement.bakerName || tenthEndorsement.bakerHash);
                })
                .get('app-endorsement .table-container .row:nth-child(1) span:nth-child(2) span')
                .should(span => {
                  expect(span.text().trim()).to.not.equal(tenthEndorsement.bakerName || tenthEndorsement.bakerHash);
                })
                .get('.table-footer form input')
                .type(tenthEndorsement.bakerHash, { force: true })
                .wait(300)
                .get('app-endorsement .table-container .row:nth-child(1) span:nth-child(2) span')
                .should(span => {
                  expect(span.text().trim()).to.equal(tenthEndorsement.bakerName || tenthEndorsement.bakerHash);
                  expect(localStorage.getItem('activeBaker')).to.equal(tenthEndorsement.bakerHash);
                });
            }
          }
        });
      });
  }));
});
