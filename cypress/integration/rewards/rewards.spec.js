import { testForTezedge } from '../../support';

const beforeRewardsTest = (test) => {
  let tested = false;
  cy.visit(Cypress.config().baseUrl + '/#/rewards', { timeout: 100000 })
    .wait(1000)
    .window()
    .its('store')
    .then({ timeout: 701000 }, store => {
      return new Cypress.Promise((resolve) => {
        setTimeout(() => resolve(), 700000);
        store.select('rewards').subscribe(rewards => {
          if (!tested && rewards.bakers.length) {
            tested = true;
            testForTezedge(test);
            resolve();
          }
        });
      });
    });
};

context('REWARDS', () => {

  it('[REWARDS] should have status code 200 for get cycle request', () => beforeRewardsTest(() => {
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

  it('[REWARDS] should have status code 200 for get bakers rewards request', () => beforeRewardsTest(() => {
    let tested = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select(state => state).subscribe(state => {
          if (!tested) {
            tested = true;
            const cycle = state.rewards.cycle;
            cy.request(state.settingsNode.activeNode.http + `/dev/rewards/cycle/${cycle}`, { timeout: 700000 })
              .its('status')
              .should('eq', 200);
          }
        });
      });
  }));

  it('[REWARDS] should create rows for the virtual scroll table', () => beforeRewardsTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('rewards').subscribe(rewards => {
          if (rewards.bakers.length) {
            cy.get('app-rewards-delegates-table cdk-virtual-scroll-viewport .row')
              .should('be.visible');
          }
        });
      });
  }));

  it('[REWARDS] should create rows for the virtual scroll table delegators', () => beforeRewardsTest(() => {
    let clicked = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select('rewards').subscribe(rewards => {
          const bakerIndex = 20;
          if (!clicked && rewards.bakers.length && rewards.bakers[bakerIndex] && rewards.bakers[bakerIndex].delegatorsLength > 0) {
            clicked = true;
            cy.get('app-rewards-delegates-table cdk-virtual-scroll-viewport .row')
              .eq(bakerIndex)
              .trigger('click')
              .get('app-rewards-delegators-table cdk-virtual-scroll-viewport .row', { timeout: 200000 })
              .window()
              .its('store')
              .then(store => {
                store.select('rewards').subscribe(rewards => {
                  if (rewards.bakers.length && rewards.sortedDelegators.length > 1) {

                    cy.url()
                      .should('include', '/rewards/' + rewards.bakers[bakerIndex].hash)
                      .get('app-rewards-delegators-table cdk-virtual-scroll-viewport .row', { timeout: 3000 })
                      .eq(0)
                      .find('> span:first-child')
                      .then(span => {
                        expect(span.text().trim()).to.equal(rewards.sortedDelegators[0].name);
                      });
                  }
                });
              });
          }
        });
      });
  }));

  it('[REWARDS] should fill the last row of the table with the last value received', () => beforeRewardsTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('rewards').subscribe(rewards => {
          if (rewards.bakers.length) {
            const baker = rewards.bakers[rewards.bakers.length - 1];
            cy.get('app-rewards-delegates-table cdk-virtual-scroll-viewport')
              .scrollTo('bottom')
              .wait(1000)
              .find('.row')
              .last()
              .find('> span:first-child')
              .then(span => {
                expect(span.text().trim()).to.equal(baker.bakerName);
              })
              .get('app-rewards-delegates-table cdk-virtual-scroll-viewport')
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

  it('[REWARDS] should select correct baker on click - the second last record in our case', () => beforeRewardsTest(() => {
    let tested = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select('rewards').subscribe(rewards => {
          if (rewards.bakers.length && !tested) {
            tested = true;
            const secondLastRecord = rewards.bakers[rewards.bakers.length - 2];
            cy.get('app-rewards-delegates-table cdk-virtual-scroll-viewport')
              .scrollTo('bottom')
              .wait(1000)
              .find('.row')
              .eq(-2)
              .trigger('click')
              .wait(1000)
              .url()
              .should('include', '/rewards/' + secondLastRecord.hash);
          }
        });
      });
  }));

  it('[REWARDS] should sort delegates by reward', () => beforeRewardsTest(() => {
    let sorted = false;
    let checked = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select('rewards').subscribe(rewards => {
          const bakers = rewards.bakers;
          if (rewards.bakers.length) {
            sorted = rewards.sort.sortBy === 'reward';
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

  it('[REWARDS] should sort delegates by balance', () => beforeRewardsTest(() => {
    let sorted = false;
    let checked = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select('rewards').subscribe(rewards => {
          const bakers = rewards.bakers;
          if (rewards.bakers.length) {
            sorted = rewards.sort.sortBy === 'balance';
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

  it('[REWARDS] should fill summary component with correct baker data', () => beforeRewardsTest(() => {
    let tested = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select('rewards').subscribe(rewards => {
          if (rewards.bakers.length && !tested) {
            tested = true;
            const baker = rewards.bakers[1];
            cy.get('app-rewards-delegates-table cdk-virtual-scroll-viewport')
              .find('.row')
              .eq(1)
              .trigger('click')
              .get('app-rewards-summary .summary-box > div:nth-child(2)')
              .then(html => expect(html.text()).to.equals(baker.hash))
              .get('app-rewards-summary .summary-box > div:nth-child(3) > div:nth-child(2)')
              .then(html => expect(html.text()).to.equals(baker.delegatorsLength.toString()))
              .get('app-rewards-summary .summary-box > div:nth-child(4) > div:nth-child(2)')
              .then(html => expect(html.text().replaceAll(' ', '')).to.include(baker.reward.toString()));
          }
        });
      });
  }));

  it('[REWARDS] should calculate baker\'s reward', () => beforeRewardsTest(() => {
    let tested = false;
    cy.window()
      .its('store')
      .then(store => {
        store.select('rewards').subscribe(rewards => {
          if (rewards.bakers.length && !tested) {
            tested = true;
            let bakersReward;
            cy.get('app-rewards-delegates-table cdk-virtual-scroll-viewport')
              .scrollTo('bottom')
              .wait(1000)
              .find('.row')
              .eq(-5)
              .trigger('click')
              .wait(1000)
              .get('app-rewards-summary .summary-box > div:nth-child(5) > div:nth-child(2)')
              .then(span => {
                const toDistribute = Number(span.text().split(' ')[0].trim());
                return bakersReward = (toDistribute * 0.1).toLocaleString('en-US', { maximumFractionDigits: 6 });
              })
              .get('app-rewards-summary .summary-box .custom-bottom-form-field input')
              .eq(0)
              .clear()
              .type('10', { force: true })
              .blur()
              .get('app-rewards-summary .summary-box > div:nth-child(6) > div:nth-child(2)')
              .then(html => expect(html.text()).to.include(bakersReward.toString()));
          }
        });
      });
  }));

});
