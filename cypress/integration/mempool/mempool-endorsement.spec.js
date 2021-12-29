context('MEMPOOL ENDORSEMENT', () => {
  beforeEach(() => {
    cy.intercept('GET', '/dev/shell/automaton/endorsing_rights*').as('getMempoolEndorsements')
      .visit(Cypress.config().baseUrl + '/#/mempool/endorsements', { timeout: 30000 })
      .wait('@getMempoolEndorsements', { timeout: 100000 })
      .wait(500);
  });

  it('[MEMPOOL ENDORSEMENT] should have status code 200 for get mempool operations request', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          store.select('networkStats').subscribe(networkStats => {
            const currentBlock = networkStats.lastAppliedBlock.hash;
            const level = networkStats.lastAppliedBlock.level;
            if (currentBlock && level) {
              cy.request(`${settingsNode.activeNode.http}/dev/shell/automaton/endorsing_rights?block=${currentBlock}&level=${level}`)
                .its('status')
                .should('eq', 200);
            }
          });
        });
      });
  });

  it('[MEMPOOL ENDORSEMENT] should create rows for the virtual scroll table', () => {
    cy.get('.row')
      .should('be.visible');
  });

  it('[MEMPOOL ENDORSEMENT] should display correct color based on status', () => {
    let oneStrike = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (!oneStrike) {
            oneStrike = true;
            const endorsements = mempool.endorsementState.endorsements;
            endorsements.forEach((endorsement, index) => {
              cy.get('.row:nth-child(' + (index + 1) + ')')
                .find('.status')
                .should('have.class', endorsement.status || 'missing', { timeout: 0 });
            });
          }
        });
      });
  });

  it('[MEMPOOL ENDORSEMENT] should show red text for big values for delta column', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.endorsementState.endorsements.length) {
            if (mempool.endorsementState.endorsements[0].delta > 50000000) {
              cy.get('.row:not(.head):first-child span:nth-child(4) span.text-red')
                .should('be.visible');
            }
          }
        });
      });
  });

  it('[MEMPOOL ENDORSEMENT] should show yellow text for big values for delta column', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          if (mempool.endorsementState.endorsements.length) {
            const index = mempool.endorsementState.endorsements.findIndex(e => e.delta > 20000000 && e.delta < 50000000);
            if (index !== -1) {
              cy.get('.row:not(.head):nth-child(' + (index + 1) + ') span:nth-child(4) span.text-yellow')
                .should('be.visible');
            }
          }
        });
      });
  });

  it('[MEMPOOL ENDORSEMENT] should sort column by decode delta', () => {
    let sorted = false;
    let checked = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          const mempoolEndorsements = mempool.endorsementState.endorsements;
          if (sorted && !checked) {
            checked = true;
            mempoolEndorsements.forEach((e, i) => {
              if (mempoolEndorsements[i + 1]) {
                expect((mempoolEndorsements[i].decodeTimeDelta ?? 0) >= (mempoolEndorsements[i + 1].decodeTimeDelta ?? 0)).to.be.true;
              }
            });
          }
          if (mempoolEndorsements.length && !sorted) {
            cy.get('.row.head span:nth-child(7)')
              .click()
              .wait(500)
              .get('.row.head span:nth-child(7) mat-icon.show')
              .should('be.visible')
              .then(() => sorted = true);
          }
        });
      });
  });

  it('[MEMPOOL ENDORSEMENT] should sort column by decode', () => {
    let sorted = false;
    let checked = false;
    cy.get('.row.head span:last-child mat-checkbox')
      .click()
      .wait(500)
      .window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          const mempoolEndorsements = mempool.endorsementState.endorsements;
          if (sorted && !checked) {
            checked = true;
            mempoolEndorsements.forEach((e, i) => {
              if (mempoolEndorsements[i + 1]) {
                expect((mempoolEndorsements[i].decodeTime ?? 0) >= (mempoolEndorsements[i + 1].decodeTime ?? 0)).to.be.true;
              }
            });
            return;
          }
          if (mempoolEndorsements.length && !sorted) {
            cy.get('.row.head span:nth-child(7)')
              .click()
              .wait(500)
              .get('.row.head span:nth-child(7) mat-icon.show')
              .should('be.visible')
              .then(() => sorted = true);
          }
        });
      });
  });

  // it('[MEMPOOL OPERATION] should fill the right details part with the message of the clicked row - the second last record in our case', () => {
  //   cy.window()
  //     .its('store')
  //     .then(store => {
  //       store.select('mempool').subscribe(() => {
  //         cy.get('cdk-virtual-scroll-viewport')
  //           .scrollTo('bottom')
  //           .wait(1000)
  //           .find('.mempool-row')
  //           .eq(-2)
  //           .trigger('click')
  //           .wait(1000)
  //           .then(row => expect(row.hasClass('active')).to.be.true)
  //           .get('.ngx-json-viewer').should('be.visible');
  //       });
  //     });
  // });
  //
  // it('[MEMPOOL OPERATION] should fill the right details part with the message of the hovered row - the second last record in our case', () => {
  //   cy.window()
  //     .its('store')
  //     .then(store => {
  //       store.select('mempool').subscribe(() => {
  //         cy.get('cdk-virtual-scroll-viewport')
  //           .scrollTo('bottom')
  //           .wait(1000)
  //           .find('.mempool-row')
  //           .eq(-2)
  //           .trigger('mouseenter')
  //           .wait(1000)
  //           .get('.ngx-json-viewer').should('be.visible');
  //       });
  //     });
  // });
  //
  // it('[MEMPOOL OPERATION] should auto select first row on load', () => {
  //   cy.window()
  //     .its('store')
  //     .then(store => {
  //       store.select('mempool').subscribe(mempool => {
  //         cy.get('cdk-virtual-scroll-viewport')
  //           .find('.mempool-row')
  //           .first()
  //           .then(row => expect(row.hasClass('active')).to.be.true)
  //           .get('cdk-virtual-scroll-viewport .mempool-row:first-child span:first-child')
  //           .should(span => {
  //             expect(span.text().trim()).to.equal(mempool.operationState.mempoolOperations[0].hash);
  //           });
  //       });
  //     });
  // });

});
