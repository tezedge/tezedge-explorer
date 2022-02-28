import { beforeEachForTezedge, testForTezedge, testIfFeature } from '../../support';

context('STATE MACHINE', () => {
  beforeEach(() => {
    beforeEachForTezedge(() => {
      testIfFeature('state', () => {
        cy.intercept('GET', '/dev/shell/automaton/actions?limit=*').as('getActionsRequest')
          .intercept('GET', '/dev/shell/automaton/actions_graph').as('getActionsGraph')
          .intercept('GET', '/dev/shell/automaton/actions_stats').as('getActionStatistics')
          .visit(Cypress.config().baseUrl + '/#/state', { timeout: 100000 })
          .wait('@getActionsGraph')
          .wait('@getActionsRequest')
          .wait('@getActionStatistics')
          .wait(1000);
      });
    });
  });

  it('[STATE MACHINE] should have status code 200 for state machine diagram request', () => testForTezedge(() => {
    testIfFeature('state', () => {
      cy.window()
        .its('store')
        .then(store => {
          store.select('settingsNode').subscribe(settingsNode => {
            console.log(settingsNode.activeNode.features);
            if (settingsNode.activeNode.features.some(f => f.name === 'state')) {
              cy.request(settingsNode.activeNode.http + '/dev/shell/automaton/actions_graph')
                .its('status')
                .should('eq', 200);
            }
          });
        });
    });
  }));

  it('[STATE MACHINE] should have status code 200 for state machine actions request', () => testForTezedge(() => {
    testIfFeature('state', () => {
      cy.window()
        .its('store')
        .then(store => {
          store.select('settingsNode').subscribe(settingsNode => {
            cy.request(settingsNode.activeNode.http + '/dev/shell/automaton/actions?limit=5')
              .its('status')
              .should('eq', 200);
          });
        });
    });
  }));

  it('[STATE MACHINE] should have status code 200 for state machine action statistics request', () => testForTezedge(() => {
    testIfFeature('state', () => {
      cy.window()
        .its('store')
        .then(store => {
          store.select('settingsNode').subscribe(settingsNode => {
            cy.request(settingsNode.activeNode.http + '/dev/shell/automaton/actions_stats')
              .its('status')
              .should('eq', 200);
          });
        });
    });
  }));

  it('[STATE MACHINE] should get correct number of actions as the limit successfully', () => testForTezedge(() => {
    testIfFeature('state', () => {
      const requestedActions = 10;
      cy.window()
        .its('store')
        .then(store => {
          store.select('settingsNode').subscribe(settingsNode => {
            cy.request(settingsNode.activeNode.http + '/dev/shell/automaton/actions?limit=' + requestedActions)
              .its('body.length')
              .should('eq', requestedActions);
          });
        });
    });
  }));

  it('[STATE MACHINE] should create rows for the virtual scroll table', () => testForTezedge(() => {
    testIfFeature('state', () => {
      cy.get('.virtual-scroll-container .virtualScrollRow').should('be.visible');
    });
  }));

  it('[STATE MACHINE] should fill the last row of the table with the last value received', () => testForTezedge(() => {
    testIfFeature('state', () => {
      cy.get('button.start-stream', { timeout: 10000 })
        .window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe(stateMachine => {
            if (stateMachine.actionTable.ids.length) {
              const lastId = stateMachine.actionTable.ids.length - 1;
              const lastAction = stateMachine.actionTable.entities[lastId];
              if (lastAction) {
                cy.wait(500)
                  .get('.virtual-scroll-container .virtualScrollRow')
                  .eq(-2)
                  .then(row => {
                    expect(row.children()[1].textContent.trim()).to.equal(lastAction.kind);
                  });
              }
            }
          });
        });
    });
  }));

  it('[STATE MACHINE] should change the value of the virtual scroll element when scrolling', () => testForTezedge(() => {
    testIfFeature('state', () => {
      let beforeScrollValue;
      let testExecuted = false;
      cy.get('button.start-stream', { timeout: 10000 })
        .window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe(() => {
            if (!testExecuted) {
              testExecuted = true;
              cy.get('.virtual-scroll-container .virtualScrollRow')
                .eq(-2)
                .then(row => {
                  beforeScrollValue = row.children()[1].textContent + row.children()[2].textContent;
                })

                .get('.virtual-scroll-container')
                .scrollTo('top')
                .wait(500)

                .get('.virtual-scroll-container .virtualScrollRow')
                .eq(-2)
                .then(row => {
                  expect(row.children()[1].textContent + row.children()[2].textContent).to.not.equal(beforeScrollValue);
                });
            }
          });
        });
    });
  }));

  it('[STATE MACHINE] should show properly colors for duration column values', () => testForTezedge(() => {
    testIfFeature('state', () => {
      cy.get('button.start-stream', { timeout: 10000 })
        .window()
        .its('store')
        .then(store => {
          store.select('stateMachine').subscribe(stateMachine => {
            if (stateMachine.actionTable.ids.length) {
              const yellowElementsArray = stateMachine.actionTable.ids.map(id => stateMachine.actionTable.entities[id]).filter(en => en.duration.includes('text-yellow'));
              const yellowDurationAction = yellowElementsArray[0];
              const redElementsArray = stateMachine.actionTable.ids.map(id => stateMachine.actionTable.entities[id]).filter(en => en.duration.includes('text-red'));
              const redDurationAction = redElementsArray[0];

              if (yellowDurationAction) {
                const y = (yellowDurationAction.id) * 36;
                cy.get('app-state-machine-table .virtual-scroll-container.state-table').should('be.visible')
                  .get('app-state-machine-table .virtual-scroll-container.state-table')
                  .scrollTo(0, y)
                  .wait(500)
                  .get('.virtual-scroll-container .virtualScrollRow .text-yellow', { timeout: 10000 })
                  .then(elements => {
                    expect(yellowDurationAction.duration).to.contain(elements[0].textContent);
                  });
              }
              cy.wait(1000);
              if (redDurationAction) {
                cy.get('.virtual-scroll-container')
                  .scrollTo(0, (redDurationAction.id) * 36)
                  .wait(500)
                  .get('.virtual-scroll-container .virtualScrollRow .text-red')
                  .then((elements) => {
                    expect(redDurationAction.duration).to.include(elements[0].textContent);
                  });
              }
            }
          });
        });
    });
  }));

  it('[STATE MACHINE] should fill the right details part with the action of the clicked row - the second last record in our case', () => testForTezedge(() => {
    testIfFeature('state', () => {
      cy.get('button.start-stream', { timeout: 10000 })
        .window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe(stateMachine => {
            if (stateMachine.actionTable.ids.length) {
              const secondLastRecord = stateMachine.actionTable.entities[stateMachine.actionTable.ids[stateMachine.actionTable.ids.length - 2]];

              cy.get('.virtual-scroll-container .virtualScrollRow')
                .eq(-3)
                .trigger('click')
                .wait(1000)
                .get('.ngx-json-viewer .segment-value')
                .then(elements => {
                  let elementWasFound = Array.from(elements).some(elem => elem.textContent.includes(secondLastRecord.originalId));
                  expect(elementWasFound).to.be.true;
                });
            }
          });
        });
    });
  }));

  it('[STATE MACHINE] should start playing through the actions on play button click', () => testForTezedge(() => {
    testIfFeature('state', () => {
      let activeRowText;
      cy.get('button.start-stream', { timeout: 10000 })
        .get('.virtual-scroll-container .virtualScrollRow').should('have.length.at.least', 5)
        .get('.virtual-scroll-container .virtualScrollRow.hover').should('not.exist')
        .get('.player-wrapper .play-pause:not(.arrows)')
        .trigger('click')
        .wait(1000)
        .get('.virtual-scroll-container .virtualScrollRow.hover').should('exist')
        .then(row => activeRowText = row.children()[1].textContent + row.children()[2].textContent)
        .wait(2000)
        .get('.virtual-scroll-container .virtualScrollRow.hover')
        .then(newRow => {
          expect(activeRowText).to.not.equal(newRow.children()[1].textContent + newRow.children()[2].textContent);
        });
    });
  }));

  it('[STATE MACHINE] should stop stream when selecting an action', () => testForTezedge(() => {
    testIfFeature('state', () => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe(stateMachine => {
            if (stateMachine.actionTable.ids.length) {
              cy.get('.virtual-scroll-container .virtualScrollRow')
                .eq(-3)
                .trigger('click')
                .wait(500)
                .get('.table-virtual-scroll-footer button.start-stream.inactive').should('exist')
                .get('.table-virtual-scroll-footer button.stop-stream:not(.inactive)').should('exist');
            }
          });
        });
    });
  }));

  it('[STATE MACHINE] should select correct action details tabs', () => testForTezedge(() => {
    testIfFeature('state', () => {
      cy.get('button.start-stream', { timeout: 10000 })
        .window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe((stateMachine) => {
            if (stateMachine.actionTable.ids.length) {
              cy.get('.virtual-scroll-container .virtualScrollRow')
                .eq(-3)
                .trigger('click')
                .wait(1000)
                .get('app-state-machine-action-details .payload-view .action-tabs .tab').should('have.length', 3)
                .get('app-state-machine-action-details .payload-view .action-tabs .tab:nth-child(1)').should('not.have.class', 'active')
                .get('app-state-machine-action-details .payload-view .action-tabs .tab:nth-child(2)').should('have.class', 'active')
                .get('app-state-machine-action-details .payload-view .action-tabs .tab:nth-child(3)').should('not.have.class', 'active')
                .get('app-state-machine-action-details .payload-view .action-tabs .tab:nth-child(1)')
                .trigger('click')
                .wait(500)
                .get('app-state-machine-action-details .payload-view .action-tabs .tab:nth-child(1)').should('have.class', 'active')
                .get('app-state-machine-action-details .payload-view .action-tabs .tab:nth-child(2)').should('not.have.class', 'active')
                .get('app-state-machine-action-details .payload-view .action-tabs .tab:nth-child(3)').should('not.have.class', 'active')
                .get('app-state-machine-action-details .payload-view .action-tabs .tab:nth-child(3)')
                .trigger('click')
                .wait(500)
                .get('app-state-machine-action-details .payload-view .action-tabs .tab:nth-child(1)').should('not.have.class', 'active')
                .get('app-state-machine-action-details .payload-view .action-tabs .tab:nth-child(2)').should('not.have.class', 'active')
                .get('app-state-machine-action-details .payload-view .action-tabs .tab:nth-child(3)').should('have.class', 'active');
            }
          });
        });
    });
  }));

  it('[STATE MACHINE] should show clicked action\'s diffs', () => testForTezedge(() => {
    testIfFeature('state', () => {
      cy.get('button.start-stream', { timeout: 10000 })
        .window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe(stateMachine => {
            if (stateMachine.actionTable.ids.length) {
              cy.get('.virtual-scroll-container .virtualScrollRow')
                .eq(-3)
                .trigger('click')
                .wait(500)
                .get('app-state-machine-action-details .payload-view .action-tabs .tab')
                .eq(-1)
                .trigger('click')
                .wait(1000)

                .get('app-state-machine-action-details ngx-object-diff').should('exist')
                .get('app-state-machine-action-details ngx-object-diff del').should('exist')
                .get('app-state-machine-action-details ngx-object-diff ins').should('exist')
                .get('app-state-machine-action-details ngx-object-diff .old-value')
                .then(elements => {
                  let oldValueFollowedByIns = Array.from(elements).every(elem => elem.nextElementSibling.tagName === 'INS');
                  expect(oldValueFollowedByIns).to.be.true;
                });
            }
          });
        });
    });
  }));

  it('[STATE MACHINE] should show clicked action\'s content', () => testForTezedge(() => {
    testIfFeature('state', () => {
      cy.get('button.start-stream', { timeout: 10000 })
        .window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe(stateMachine => {
            if (stateMachine.actionTable.ids.length) {
              const secondLastAction = stateMachine.actionTable.entities[stateMachine.actionTable.ids[stateMachine.actionTable.ids.length - 2]];

              cy.get('.virtual-scroll-container .virtualScrollRow')
                .eq(-3)
                .trigger('click')
                .wait(500)
                .get('app-state-machine-action-details .payload-view .action-tabs .tab:nth-child(1)')
                .trigger('click')
                .wait(1000);

              if (secondLastAction.content) {
                const key0 = Object.keys(secondLastAction.content)[0];
                if (typeof secondLastAction.content[key0] === 'string') {
                  cy.get('.ngx-json-viewer .segment-value')
                    .then(elements => {
                      let elementFound = Array.from(elements).some(elem => elem.textContent.slice(1, elem.textContent.length - 1) === secondLastAction.content[key0]);
                      expect(elementFound).to.be.true;
                    });
                }
              }
            }
          });
        });
    });
  }));

  it('[STATE MACHINE] should hide state chart on toggle click and show back on second click', () => testForTezedge(() => {
    testIfFeature('state', () => {
      cy.get('#d3Diagram').then(svg => {
        if (svg.is(':visible')) {
          cy.get('app-state-machine-diagram .state-toolbar .diagram-toggler')
            .trigger('click')
            .wait(1000)
            .get('#d3Diagram').invoke('height').should('eq', 0)

            .get('app-state-machine-diagram .state-toolbar .diagram-toggler')
            .trigger('click')

            .wait(1000)
            .get('#d3Diagram').invoke('height').should('be.gt', 0);
        }
      });
    });
  }));

  it('[STATE MACHINE] should update local storage collapsedDiagram property when toggling the state chart', () => testForTezedge(() => {
    testIfFeature('state', () => {
      expect(localStorage.getItem('collapsedDiagram')).to.be.null;
      cy.get('#d3Diagram')
        .get('app-state-machine-diagram .state-toolbar .diagram-toggler')
        .trigger('click')
        .wait(200)
        .then(() => {
          expect(localStorage.getItem('collapsedDiagram')).to.eq('true');
        })
        .get('app-state-machine-diagram .state-toolbar .diagram-toggler')
        .trigger('click')
        .wait(200)
        .then(() => {
          expect(localStorage.getItem('collapsedDiagram')).to.eq('false');
        });
    });
  }));

  it('[STATE MACHINE] should update local storage diagramHeight when dragging the resizer', () => testForTezedge(() => {
    testIfFeature('state', () => {
      expect(localStorage.getItem('diagramHeight')).to.be.null;
      cy.get('#d3Diagram')
        .get('app-state-machine .resizer-element .mid-content')
        .trigger('mousedown')
        .trigger('mousemove', { clientX: 50, clientY: 450 })
        .wait(1000)
        .trigger('mouseup')
        .wait(1000)
        .then(() => {
          let diagramHeight = localStorage.getItem('diagramHeight');
          expect(diagramHeight).to.not.be.null;
          expect(Number(diagramHeight)).to.be.greaterThan(0);
        });
    });
  }));

  it('[STATE MACHINE] should render state chart successfully', () => testForTezedge(() => {
    testIfFeature('state', () => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe(stateMachine => {
            if (stateMachine.diagramBlocks.length > 0) {
              cy.wait(1000)
                .get('#d3Diagram svg').should('be.visible')
                .then(svg => {
                  expect(svg.height()).to.be.greaterThan(0);
                  expect(svg.width()).to.be.greaterThan(0);
                })
                .get('#d3Diagram svg g').should('have.attr', 'transform')
                .get('#d3Diagram svg g .edgePaths').should('be.visible')
                .get('#d3Diagram svg g .edgeLabels').should('be.visible')
                .get('#d3Diagram svg g .nodes').should('be.visible')
                .then(nodes => {
                  expect(nodes.children()).to.have.length(stateMachine.diagramBlocks.length);
                });
            }
          });
        });
    });
  }));

  it('[STATE MACHINE] should zoom in state chart successfully on mouse wheel up', () => testForTezedge(() => {
    testIfFeature('state', () => {
      let initialTransform;
      cy.get('#d3Diagram svg', { timeout: 10000 })
        .get('#d3Diagram svg > g')
        .then(e => {
          initialTransform = e.attr('transform');
        })
        .wait(500)
        .get('#d3Diagram svg')
        .trigger('wheel', {
          deltaY: 500,
          wheelDelta: 12000,
          wheelDeltaX: 1000,
          wheelDeltaY: 1000,
          bubbles: true
        })
        .wait(1000)
        .get('#d3Diagram svg > g')
        .then(e => {
          expect(e.attr('transform')).not.equal(initialTransform);
        });
    });
  }));

  it('[STATE MACHINE] should zoom in state chart successfully on plus button', () => testForTezedge(() => {
    testIfFeature('state', () => {
      let initialTransform;
      cy.get('#d3Diagram svg', { timeout: 10000 })
        .get('#d3Diagram svg > g')
        .then(e => {
          initialTransform = e.attr('transform');
        })
        .wait(500)
        .get('app-state-machine-diagram .zoom-group div:first-child')
        .trigger('click')
        .wait(800)
        .get('#d3Diagram svg > g')
        .then(e => {
          expect(e.attr('transform')).not.equal(initialTransform);
        });
    });
  }));

  it('[STATE MACHINE] should zoom out state chart successfully on minus button', () => testForTezedge(() => {
    testIfFeature('state', () => {
      let initialTransform;
      cy.get('#d3Diagram svg', { timeout: 10000 })
        .get('#d3Diagram svg > g')
        .then(e => {
          initialTransform = e.attr('transform');
        })
        .wait(500)
        .get('app-state-machine-diagram .zoom-group div:last-child')
        .trigger('click')
        .wait(800)
        .get('#d3Diagram svg > g')
        .then(e => {
          expect(e.attr('transform')).not.equal(initialTransform);
        });
    });
  }));

  it('[STATE MACHINE] should show whole state chart successfully on reset zoom button', () => testForTezedge(() => {
    testIfFeature('state', () => {
      let initialTransform;
      cy.get('#d3Diagram svg', { timeout: 10000 })
        .get('#d3Diagram svg > g')
        .then(e => {
          initialTransform = e.attr('transform');
        })
        .wait(500)
        .get('app-state-machine-diagram .zoom-group div:last-child')
        .trigger('click', { force: true })
        .wait(800)
        .get('.full-diagram .icon-background')
        .trigger('click', { force: true })
        .wait(800)
        .get('#d3Diagram svg > g')
        .then(e => {
          expect(e.attr('transform')).equal(initialTransform);
        });
    });
  }));

  it('[STATE MACHINE] should disable next and prev action buttons if no action is selected', () => testForTezedge(() => {
    testIfFeature('state', () => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe(stateMachine => {
            if (!stateMachine.activeAction && stateMachine.actionTable.ids.length) {
              cy.get('.player-wrapper .play-pause:not(.arrows)').should('be.not.disabled')
                .get('.player-wrapper .play-pause.arrows:nth-child(2)').should('be.disabled')
                .get('.player-wrapper .play-pause.arrows:nth-child(3)').should('be.disabled');
            }
          });
        });
    });
  }));

  it('[STATE MACHINE] should highlight the correct svg block in the diagram on action click', () => testForTezedge(() => {
    testIfFeature('state', () => {
      let rowActionName;
      cy.get('button.start-stream', { timeout: 10000 })
        .get('.virtual-scroll-container .virtualScrollRow').should('have.length.at.least', 5)
        .get('.virtual-scroll-container .virtualScrollRow')
        .eq(-3)
        .trigger('click')
        .wait(1000)
        .get('.virtual-scroll-container .virtualScrollRow.hover')
        .then(row => rowActionName = row.children()[1].textContent.trim())
        .wait(2000)
        .get('#d3Diagram svg > g g.nodes g.node.active', { timeout: 20000 })
        .then(g => expect(g.attr('id')).equal(rowActionName))
        .get('#d3Diagram svg > g g.nodes g.node.active text tspan', { timeout: 20000 })
        .then(tspan => expect(tspan.text().trim()).equal(rowActionName))
        .get('#d3Diagram svg > g g.edgePaths .connection-prev', { timeout: 20000 })
        .then(g => expect(g.attr('id')).to.include('-' + rowActionName))
        .get('#d3Diagram svg > g g.edgePaths .connection-next', { timeout: 20000 })
        .then(g => expect(g.attr('id')).to.include(rowActionName + '-'));
    });
  }));

  it('[STATE MACHINE] should update progress bar on action click', () => testForTezedge(() => {
    testIfFeature('state', () => {
      let initialValue;
      cy.get('button.start-stream', { timeout: 10000 })
        .get('.virtual-scroll-container .virtualScrollRow').should('have.length.at.least', 5)
        .get('mat-slider').should('exist')
        .then(slider => {
          initialValue = slider.attr('aria-valuenow');
          expect(initialValue).equal('0');
        })
        .get('.virtual-scroll-container')
        .scrollTo('top')
        .wait(1000)
        .get('.virtual-scroll-container .virtualScrollRow')
        .eq(3)
        .trigger('click')
        .wait(500)
        .get('mat-slider').should('exist')
        .then(slider => {
          expect(slider.attr('aria-valuenow')).not.equal(initialValue);
          expect(slider.attr('aria-valuenow')).equal('3');
        });
    });
  }));

  it('[STATE MACHINE] should render filter buttons and categories', () => testForTezedge(() => {
    testIfFeature('state', () => {
      const categories = ['P2p', 'PeerHandshaking', 'PeerConnection', 'YieldedOperations', 'PausedLoops', 'PeersGraylist', 'PeerMessage', 'PeerBinary', 'PeerChunk', 'PeerTry', 'PeersDns', 'PeersCheck', 'Storage', 'Others'];
      let stats;
      cy.window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe(stateMachine => {
            if (stateMachine.actionStatistics.statistics) {
              stats = stateMachine.actionStatistics.statistics.map(a => a.kind);
            }
          });
        })
        .wait(1000)
        .get('mat-expansion-panel-header').should('exist')
        .get('.mat-expansion-panel-content .table-filters').should('not.exist')
        .get('mat-expansion-panel-header button.add-filters')
        .trigger('click', { force: true })
        .wait(1000)
        .get('.mat-expansion-panel-content .table-filters').should('exist');

      if (stats) {
        cy.get('.table-filters .filters-label').should('have.length.at.most', categories.length)
          .then(labels => {
            const labelTexts = Array.from(labels).map(l => l.textContent);
            labelTexts.pop();
            labelTexts.forEach(label => {
              expect(stats.some(action => action.startsWith(label))).to.be.true;
            });
          })
          .get('.table-filters div div button').should('have.length', stats.length)
          .then(filters => {
            Array.from(filters).map(f => f.textContent).forEach(text => {
              expect(stats.some(action => ' ' + action + ' ' === text)).to.be.true;
            });
          });
      }
    });

  }));

  it('[STATE MACHINE] should apply filters on click', () => testForTezedge(() => {
    testIfFeature('state', () => {
      let clickedFilter;
      cy.wait(500)
        .get('.filters-content button').should('not.exist')
        .get('.add-filters')
        .trigger('click')
        .wait(1000)
        .get('.table-filters div div button')
        .eq(-1)
        .trigger('click')
        .then(clicked => clickedFilter = clicked)
        .get('.filters-content button').should('exist')
        .then(appliedFilter => {
          expect(appliedFilter[0].textContent).equal(clickedFilter[0].textContent);
        })
        .get('.table-filters div div button')
        .eq(-2)
        .trigger('click')
        .get('.filters-content button').should('have.length', 2);
    });
  }));

  it('[STATE MACHINE] should successfully render action statistics', () => testForTezedge(() => {
    testIfFeature('state', () => {
      let stats;
      cy.wait(500)
        .get('app-state-machine-action-details .payload-view div div:last-child .tab')
        .trigger('click')
        .wait(300)
        .get('.statistics-table').should('be.visible')
        .window()
        .its('store')
        .then((store) => {
          store.select('stateMachine').subscribe(stateMachine => {
            if (stateMachine.actionStatistics.statistics) {
              stats = stateMachine.actionStatistics.statistics;
            }
          });
        })
        .wait(1000);
      if (stats) {
        cy.get('.statistics-table .overflow-auto > div').should('have.length', stats.length);
      }
    });
  }));

});
