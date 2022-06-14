import { testForTezedge } from '../../support';

const beforeBakingTest = (test) => {
  let tested = false;
  cy.visit(Cypress.config().baseUrl + '/#/baking', { timeout: 100000 })
    .wait(1000)
    .window()
    .its('store')
    .then({ timeout: 701000 }, store => {
      return new Cypress.Promise((resolve) => {
        setTimeout(() => resolve(), 700000);
        store.select('baking').subscribe(baking => {
          if (!tested && baking.bakers.length) {
            tested = true;
            testForTezedge(test);
            resolve();
          }
        });
      });
    });
};

context('BAKING', () => {

  it('[BAKING] should have status code 200 for get cycle request', () => beforeBakingTest(() => {
    cy.wait(1000)
      .window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          cy.request(settingsNode.activeNode.http + '/chains/main/blocks/head~2/metadata')
            .its('status')
            .should('eq', 200);
        });
      });
  }));

  it('[BAKING] should have status code 200 for get bakers rewards request', () => beforeBakingTest(() => {
    let tested = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select(state => state).subscribe(state => {
          if (!tested) {
            tested = true;
            const cycle = state.baking.cycle;
            cy.request(state.settingsNode.activeNode.http + `/dev/rewards/cycle/${cycle}`, { timeout: 700000 })
              .its('status')
              .should('eq', 200);
          }
        });
      });
  }));

  it('[BAKING] should create rows for the virtual scroll table', () => beforeBakingTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('baking').subscribe(baking => {
          if (baking.bakers.length) {
            cy.get('app-baking-delegates-table cdk-virtual-scroll-viewport .row')
              .should('be.visible');
          }
        });
      });
  }));

  it('[BAKING] should create rows for the virtual scroll table delegators', () => beforeBakingTest(() => {
    let clicked = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select('baking').subscribe(baking => {
          const bakerIndex = 20;
          if (!clicked && baking.bakers.length && baking.bakers[bakerIndex] && baking.bakers[bakerIndex].delegatorsLength > 0) {
            clicked = true;
            cy.get('app-baking-delegates-table cdk-virtual-scroll-viewport .row')
              .eq(bakerIndex)
              .trigger('click')
              .get('app-baking-delegators-table cdk-virtual-scroll-viewport .row', { timeout: 200000 })
              .window()
              .its('store')
              .then(store => {
                store.select('baking').subscribe(baking => {
                  if (baking.bakers.length && baking.sortedDelegators.length > 1) {

                    cy.url()
                      .should('include', '/baking/' + baking.bakers[bakerIndex].hash)
                      .get('app-baking-delegators-table cdk-virtual-scroll-viewport .row', { timeout: 3000 })
                      .eq(0)
                      .find('> span:first-child')
                      .then(span => {
                        expect(span.text().trim()).to.equal(baking.sortedDelegators[0].name);
                      });
                  }
                });
              });
          }
        });
      });
  }));

  it('[BAKING] should fill the last row of the table with the last value received', () => beforeBakingTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('baking').subscribe(baking => {
          if (baking.bakers.length) {
            const baker = baking.bakers[baking.bakers.length - 1];
            cy.get('app-baking-delegates-table cdk-virtual-scroll-viewport')
              .scrollTo('bottom')
              .wait(1000)
              .find('.row')
              .last()
              .find('> span:first-child')
              .then(span => {
                expect(span.text().trim()).to.equal(baker.bakerName);
              })
              .get('app-baking-delegates-table cdk-virtual-scroll-viewport')
              .find('.row')
              .last()
              .find('> span:nth-child(2)')
              .then(span => {
                expect(span.text().trim().replaceAll(' ', '')).to.equal(baker.reward.toString());
              });
          }
        });
      });
  }));

  it('[BAKING] should select correct baker on click - the second last record in our case', () => beforeBakingTest(() => {
    let tested = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select('baking').subscribe(baking => {
          if (baking.bakers.length && !tested) {
            tested = true;
            const secondLastRecord = baking.bakers[baking.bakers.length - 2];
            cy.get('app-baking-delegates-table cdk-virtual-scroll-viewport')
              .scrollTo('bottom')
              .wait(1000)
              .find('.row')
              .eq(-2)
              .trigger('click')
              .wait(1000)
              .url()
              .should('include', '/baking/' + secondLastRecord.hash);
          }
        });
      });
  }));

  it('[BAKING] should sort delegates by reward', () => beforeBakingTest(() => {
    let sorted = false;
    let checked = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select('baking').subscribe(baking => {
          const bakers = baking.bakers;
          if (baking.bakers.length) {
            sorted = baking.sort.sortBy === 'reward';
            if (sorted && !checked) {
              checked = true;
              bakers.forEach((e, i) => {
                if (bakers[i + 1]) {
                  expect((bakers[i].reward ?? 0) >= (bakers[i + 1].reward ?? 0)).to.be.true;
                }
              });
            }
            if (!sorted) {
              cy.get('.row.head span:nth-child(3)')
                .click();
            }
          }
        });
      });
  }));

  it('[BAKING] should sort delegates by balance', () => beforeBakingTest(() => {
    let sorted = false;
    let checked = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select('baking').subscribe(baking => {
          const bakers = baking.bakers;
          if (baking.bakers.length) {
            sorted = baking.sort.sortBy === 'balance';
            if (sorted && !checked) {
              checked = true;
              bakers.forEach((e, i) => {
                if (bakers[i + 1]) {
                  expect((bakers[i].balance ?? 0) >= (bakers[i + 1].balance ?? 0)).to.be.true;
                }
              });
            }
            if (!sorted) {
              cy.get('.row.head span:nth-child(3)')
                .click();
            }
          }
        });
      });
  }));

  it('[BAKING] should fill summary component with correct baker data', () => beforeBakingTest(() => {
    let tested = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select('baking').subscribe(baking => {
          if (baking.bakers.length && !tested) {
            tested = true;
            const baker = baking.bakers[1];
            cy.get('app-baking-delegates-table cdk-virtual-scroll-viewport')
              .find('.row')
              .eq(1)
              .trigger('click')
              .get('app-baking-summary .summary-box > div:nth-child(2)')
              .then(html => expect(html.text()).to.equals(baker.hash))
              .get('app-baking-summary .summary-box > div:nth-child(3) > div:nth-child(2)')
              .then(html => expect(html.text()).to.equals(baker.delegatorsLength.toString()))
              .get('app-baking-summary .summary-box > div:nth-child(4) > div:nth-child(2)')
              .then(html => expect(html.text().replaceAll(' ', '')).to.include(baker.reward.toString()));
          }
        });
      });
  }));

  it('[BAKING] should calculate baker\'s reward', () => beforeBakingTest(() => {
    let tested = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select('baking').subscribe(baking => {
          if (baking.bakers.length && !tested) {
            tested = true;
            let bakersReward;
            cy.get('app-baking-delegates-table cdk-virtual-scroll-viewport')
              .scrollTo('bottom')
              .wait(1000)
              .find('.row')
              .eq(-5)
              .trigger('click')
              .wait(1000)
              .get('app-baking-summary .summary-box > div:nth-child(5) > div:nth-child(2)')
              .then(span => {
                const toDistribute = Number(span.text().split(' ')[0].trim());
                return bakersReward = (toDistribute * 0.1).toLocaleString('en-US', { maximumFractionDigits: 6 });
              })
              .get('app-baking-summary .summary-box .custom-bottom-form-field input')
              .eq(0)
              .clear()
              .type('10', { force: true })
              .blur()
              .get('app-baking-summary .summary-box > div:nth-child(6) > div:nth-child(2)')
              .then(html => expect(html.text()).to.include(bakersReward.toString()));
          }
        });
      });
  }));

});