context('STATE MACHINE', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
    cy.wait(1000);
    cy.visit(Cypress.config().baseUrl + '/#/state', { timeout: 10000 });
  });

  // it('[STATE MACHINE] should perform state machine diagram request successfully', () => {
  //   cy.intercept('GET', '/dev/shell/automaton/actions_graph').as('getDiagramRequest');
  //   cy.wait('@getDiagramRequest', { timeout: 30000 }).its('response.statusCode').should('eq', 200);
  // });

  it('[STATE MACHINE] should perform state machine actions request successfully', () => {
    cy.intercept('GET', '/dev/shell/automaton/actions?*').as('getActionsRequest');
    cy.wait('@getActionsRequest', { timeout: 10000 }).its('response.statusCode').should('eq', 200);
  });

  it('[STATE MACHINE] should get 1000 actions for limit 1000 successfully', () => {
    cy.intercept('GET', '/dev/shell/automaton/actions?limit=1000').as('getActionsRequest');
    cy.wait('@getActionsRequest', { timeout: 10000 }).its('response.body.length').should('eq', 1000);
  });

  it('[STATE MACHINE] should create rows for the virtual scroll table', () => {
    cy.get('.virtual-scroll-container').find('.virtualScrollRow');
  });

  it('[STATE MACHINE] should fill the last row of the table with the last value received', () => {
    cy.wait(5000).then(() => {
      cy.get('.stop-stream').click();

      cy.window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe(stateMachine => {
            if (!stateMachine.actionTable.stream) {
              const lastAction = stateMachine.actionTable.entities[stateMachine.actionTable.ids[stateMachine.actionTable.ids.length - 1]];

              cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(3) span:nth-child(2)')
                .should(($span) => {
                  expect($span.text().trim()).to.equal(lastAction.type);
                });
            } else {
              cy.get('.stop-stream').click();
            }
          });
        });
    });
  });
  it('[STATE MACHINE] should show properly colors for duration column values', () => {
    cy.wait(5000).then(() => {
      cy.get('.stop-stream').click();

      cy.window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe(stateMachine => {
            if (!stateMachine.actionTable.stream) {
              const yellowDurationAction = stateMachine.actionTable.ids.map(id => stateMachine.actionTable.entities[id]).find(en => en.duration.includes('text-yellow'));
              const redDurationAction = stateMachine.actionTable.ids.map(id => stateMachine.actionTable.entities[id]).find(en => en.duration.includes('text-red'));
              if (yellowDurationAction) {
                cy.get('.virtual-scroll-container').scrollTo(0, (yellowDurationAction.id) * 36);
                cy.wait(500).then(() => {
                  let spans;
                  cy.get('.virtual-scroll-container .virtualScrollRow .text-yellow')
                    .should(elements => spans = elements);
                  cy.wait(300).then(() => cy.wrap(yellowDurationAction.duration).should('include', spans[0].textContent));
                });
              }
              cy.wait(1000).then(() => {
                if (redDurationAction) {
                  cy.get('.virtual-scroll-container').scrollTo(0, (redDurationAction.id) * 36);
                  cy.wait(500).then(() => {
                    let spans;
                    cy.get('.virtual-scroll-container .virtualScrollRow .text-red')
                      .should(elements => spans = elements);
                    cy.wait(300).then(() => cy.wrap(redDurationAction.duration).should('include', spans[0].textContent));
                  });
                }
              });
            } else {
              cy.get('.stop-stream').click();
            }
          });
        });
    });
  });


  it('[STATE MACHINE] should change the value of the virtual scroll element when scrolling', () => {
    let beforeScrollValue;

    cy.wait(5000).then(() => {
      cy.get('.stop-stream').click();

      cy.window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe(stateMachine => {
            if (!stateMachine.actionTable.stream) {
              cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(3) span:nth-child(2)')
                .then(($span) => {
                  beforeScrollValue = $span.text();
                });

              cy.get('.virtual-scroll-container').scrollTo('top');

              cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(3) span:nth-child(2)')
                .should(($span) => {
                  expect($span.text()).to.not.equal(beforeScrollValue);
                });
            } else {
              cy.get('.stop-stream').click();
            }
          });
        });
    });
  });

  it('[STATE MACHINE] should stop stream when selecting an action', () => {
    cy.wait(5000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe(stateMachine => {
            if (stateMachine.actionTable.ids.length) {
              cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(4)')
                .trigger('click');
              cy.wait(500).then(() => {
                cy.get('.table-virtual-scroll-footer button.start-stream.inactive').should('exist');
                cy.get('.table-virtual-scroll-footer button.stop-stream:not(.inactive)').should('exist');
              });
            }
          });
        });
    });
  });

  it('[STATE MACHINE] should fill the right details part with the action of the clicked row - the second last record in our case', () => {
    cy.wait(5000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe(stateMachine => {
            if (stateMachine.actionTable.ids.length) {
              const secondLastRecord = stateMachine.actionTable.entities[stateMachine.actionTable.ids[stateMachine.actionTable.ids.length - 2]];

              cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(4)')
                .trigger('click');
              let elementFound;
              cy.get('.ngx-json-viewer .segment-value').should(elements => {
                elementFound = Array.from(elements).some(elem => elem.textContent === secondLastRecord.originalId);
              });
              cy.wait(500).then(() => cy.wrap(elementFound).should('eq', true));
            }
          });
        });
    });
  });

  it('[STATE MACHINE] should select correct action details tabs', () => {
    cy.wait(5000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe((sm) => {
            if (sm.actionTable.ids.length) {
              cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(4)')
                .trigger('click');
              cy.wait(500).then(() => {
                cy.get('app-state-machine-action-details .tabs .tab').should('have.length', 3);
                cy.wait(500).then(() => cy.get('app-state-machine-action-details .tabs .tab:nth-child(1):not(.active)').should('exist'));
                cy.wait(500).then(() => cy.get('app-state-machine-action-details .tabs .tab:nth-child(2).active').should('exist'));
                cy.wait(500).then(() => cy.get('app-state-machine-action-details .tabs .tab:nth-child(3):not(.active)').should('exist'));

                cy.get('app-state-machine-action-details .tabs .tab:nth-child(1)').trigger('click');
                cy.wait(600).then(() => cy.get('app-state-machine-action-details .tabs .tab:nth-child(1).active').should('exist'));
                cy.wait(600).then(() => cy.get('app-state-machine-action-details .tabs .tab:nth-child(2):not(.active)').should('exist'));
                cy.wait(600).then(() => cy.get('app-state-machine-action-details .tabs .tab:nth-child(3):not(.active)').should('exist'));

                cy.get('app-state-machine-action-details .tabs .tab:nth-child(3)').trigger('click');
                cy.wait(700).then(() => cy.get('app-state-machine-action-details .tabs .tab:nth-child(1):not(.active)').should('exist'));
                cy.wait(700).then(() => cy.get('app-state-machine-action-details .tabs .tab:nth-child(2):not(.active)').should('exist'));
                cy.wait(700).then(() => cy.get('app-state-machine-action-details .tabs .tab:nth-child(3).active').should('exist'));
              });
            }
          });
        });
    });
  });

  it('[STATE MACHINE] should show clicked action\'s content', () => {
    cy.wait(5000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe(stateMachine => {
            if (stateMachine.actionTable.ids.length) {
              const secondLastAction = stateMachine.actionTable.entities[stateMachine.actionTable.ids[stateMachine.actionTable.ids.length - 2]];

              cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(4)')
                .trigger('click');
              cy.wait(500).then(() => {
                cy.get('app-state-machine-action-details .tabs .tab:nth-child(1)')
                  .trigger('click');
                cy.wait(500).then(() => cy.get('app-state-machine-action-details .tabs .tab:nth-child(1).active').should('exist'));
                cy.wait(500).then(() => cy.get('app-state-machine-action-details .tabs .tab:nth-child(2):not(.active)').should('exist'));

                const key0 = Object.keys(secondLastAction.content)[0];
                if (typeof secondLastAction.content[key0] === 'string') {
                  let elementFound;
                  cy.get('.ngx-json-viewer .segment-value').should(elements => {
                    elementFound = Array.from(elements).some(elem => elem.textContent.slice(1, elem.textContent.length - 1) === secondLastAction.content[key0]);
                  });
                  cy.wait(500).then(() => cy.wrap(elementFound).should('eq', true));
                }
              });
            }
          });
        });
    });
  });

  it('[STATE MACHINE] should show clicked action\'s diffs', () => {
    cy.wait(5000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe(stateMachine => {
            if (stateMachine.actionTable.ids.length) {
              cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(4)')
                .trigger('click');
              cy.wait(500).then(() => {
                cy.get('app-state-machine-action-details .tabs .tab:nth-child(3)')
                  .trigger('click');

                cy.get('app-state-machine-action-details ngx-object-diff').should('be.visible');
                cy.get('app-state-machine-action-details ngx-object-diff del').should('have.length.above', 0);
                cy.get('app-state-machine-action-details ngx-object-diff ins').should('have.length.above', 0);
                let oldValueFollowedByIns;
                cy.get('app-state-machine-action-details ngx-object-diff .old-value').should(elements => {
                  oldValueFollowedByIns = Array.from(elements).every(elem => elem.nextElementSibling.tagName === 'INS');
                });
                cy.wait(500).then(() => cy.wrap(oldValueFollowedByIns).should('eq', true));
              });
            }
          });
        });
    });
  });

  it('[STATE MACHINE] should hide state chart on toggle click', () => {
    cy.wait(1000).then(() => {
      cy.get('#d3Diagram').then(svg => {
        if (svg.is(':visible')) {
          cy.get('app-state-machine-diagram .state-toolbar .diagram-toggler').trigger('click');

          cy.wait(500).then(() => {
            cy.get('#d3Diagram').invoke('height').should('eq', 0);
          });

          cy.get('app-state-machine-diagram .state-toolbar .diagram-toggler').trigger('click');

          cy.wait(500).then(() => {
            cy.get('#d3Diagram').invoke('height').should('be.gt', 0);
          });
        }
      });
    });
  });
});
