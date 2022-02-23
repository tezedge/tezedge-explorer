context('MEMPOOL BLOCK APPLICATION', () => {
  beforeEach(() => {
    cy.intercept('GET', '/dev/shell/automaton/block_stats/graph?limit*').as('getMempoolGraph')
      .visit(Cypress.config().baseUrl + '/#/mempool/block-application', { timeout: 30000 })
      .wait('@getMempoolGraph', { timeout: 100000 })
      .wait(500);
  });

  it('[MEMPOOL BLOCK APPLICATION] should have status code 200 for get mempool block application graph request', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          cy.request(settingsNode.activeNode.http + '/dev/shell/automaton/block_stats/graph?limit=200')
            .its('status')
            .should('eq', 200);
        });
      });
  });

  it('[MEMPOOL BLOCK APPLICATION] should get correct number of actions as the limit successfully', () => {
    const requestedActions = 250;
    cy.window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          cy.request(settingsNode.activeNode.http + '/dev/shell/automaton/block_stats/graph?limit=' + requestedActions)
            .its('body.length')
            .should('eq', requestedActions);
        });
      });
  });

  it('[MEMPOOL BLOCK APPLICATION] should calculate correct average values', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          const averageValues = mempool.blockApplicationState.chartLines.map(line => ({
            name: line.name,
            value: line.series.reduce((a, b) => a + b.value, 0) / line.series.length
          }));
          averageValues.forEach((avg, i) => {
            expect(avg.value).to.equal(mempool.blockApplicationState.averageValues[i].value);
            expect(avg.name).to.equal(mempool.blockApplicationState.averageValues[i].name);
          });
        });
      });
  });

  it('[MEMPOOL BLOCK APPLICATION] should show correct number of blocks in the graph overview title', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('mempool').subscribe(mempool => {
          cy.get('app-mempool-block-application .blocks-overview')
            .then(element => {
              expect(element.text()).to.equal(mempool.blockApplicationState.noOfBlocks + ' BLOCKS OVERVIEW');
            });
        });
      });
  });

  it('[MEMPOOL BLOCK APPLICATION] should display redirection overlay on chart when clicking on it and navigate to tzstats on click', () => {
    let routed;
    cy.window()
      .then((win) => {
        cy
          .stub(win, 'open', url => {
            win.location.href = Cypress.config().baseUrl + url;
          })
          .as('popup');
      });
    cy.window()
      .its('store')
      .then(store => {
        store.subscribe(store => {
          if (!routed && store.mempool.blockApplicationState.chartLines.length) {
            routed = true;
            cy.get('app-mempool-block-application app-tezedge-line-chart svg g g g rect.tooltip-area')
              .click(300, 20)
              .wait(1000)
              .get('app-graph-redirection-overlay .redirection-overlay').should('be.visible')
              .get('app-graph-redirection-overlay .redirection-overlay .pointer')
              .eq(0).click()
              .wait(1000)
              .get('@popup').should('be.called');
          }
        });
      });
  });

  it('[MEMPOOL BLOCK APPLICATION] should display redirection overlay on chart when clicking on it and navigate to tzstats on click', () => {
    let routed;
    cy.window()
      .its('store')
      .then(store => {
        store.subscribe(store => {
          if (!routed && store.mempool.blockApplicationState.chartLines.length) {
            routed = true;
            cy.get('app-mempool-block-application app-tezedge-line-chart svg g g g rect.tooltip-area')
              .click(300, 20)
              .wait(1000)
              .get('app-graph-redirection-overlay .redirection-overlay').should('be.visible')
              .get('app-graph-redirection-overlay .redirection-overlay .pointer')
              .eq(1).click()
              .wait(1000)
              .url().should('include', '/resources');
          }
        });
      });
  });

  it('[MEMPOOL BLOCK APPLICATION] should display redirection overlay on chart when clicking on it and navigate to resources on click', () => {
    let routed;
    cy.window()
      .its('store')
      .then(store => {
        store.subscribe(store => {
          if (!routed && store.mempool.blockApplicationState.chartLines.length) {
            routed = true;
            cy.get('app-mempool-block-application app-tezedge-line-chart svg g g g rect.tooltip-area')
              .click(300, 20)
              .wait(1000)
              .get('app-graph-redirection-overlay .redirection-overlay').should('be.visible')
              .get('app-graph-redirection-overlay .redirection-overlay .pointer')
              .eq(2).click()
              .wait(1000)
              .url().should('include', '/storage');
          }
        });
      });
  });

  it('[MEMPOOL BLOCK APPLICATION] should display redirection overlay on chart when clicking on it and navigate to network on click', () => {
    let routed;
    cy.window()
      .its('store')
      .then(store => {
        store.subscribe(store => {
          if (!routed && store.mempool.blockApplicationState.chartLines.length) {
            routed = true;
            cy.get('app-mempool-block-application app-tezedge-line-chart svg g g g rect.tooltip-area')
              .click(300, 20)
              .wait(1000)
              .get('app-graph-redirection-overlay .redirection-overlay').should('be.visible')
              .get('app-graph-redirection-overlay .redirection-overlay .pointer')
              .eq(3).click()
              .wait(1000)
              .url().should('include', '/network?timestamp=');
          }
        });
      });
  });

  it('[MEMPOOL BLOCK APPLICATION] should display redirection overlay on chart when clicking on it and navigate to logs on click', () => {
    let routed;
    cy.window()
      .its('store')
      .then(store => {
        store.subscribe(store => {
          if (!routed && store.mempool.blockApplicationState.chartLines.length) {
            routed = true;
            cy.get('app-mempool-block-application app-tezedge-line-chart svg g g g rect.tooltip-area')
              .click(300, 20)
              .wait(1000)
              .get('app-graph-redirection-overlay .redirection-overlay').should('be.visible')
              .get('app-graph-redirection-overlay .redirection-overlay .pointer')
              .last().click()
              .wait(1000)
              .url().should('include', '/logs?timestamp=');
          }
        });
      });
  });

  it('[MEMPOOL BLOCK APPLICATION] should have correct x axis ticks', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.subscribe(store => {
          if (store) {
            const getTicks = (series, noOfResults, xProperty) => {
              const xTicks = [];
              const delta = Math.floor(series.length / noOfResults);
              for (let i = 0; i <= series.length; i = i + delta) {
                if (series[i]) {
                  xTicks.push(series[i][xProperty]);
                }
              }
              return xTicks;
            };
            const series = store.mempool.blockApplicationState.chartLines[0].series;
            const xTicksValues = getTicks(series, Math.min(series.length, store.mempool.blockApplicationState.xTicksValuesLength), 'name');

            xTicksValues.forEach((tick, i) => {
              expect(tick).to.equal(store.mempool.blockApplicationState.xTicksValues[i]);
            });
          }
        });
      });
  });

});
