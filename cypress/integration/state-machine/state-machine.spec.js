const testForTezedge = (test) => {
  cy.get('app-settings-node .settings-node-select mat-select').then(select => {
    if (select.attr('id') === 'tezedge') {
      test();
    }
  });
};

context('STATE MACHINE', () => {
  beforeEach(() => {
    cy.intercept('GET', '/dev/shell/automaton/actions?limit=*').as('getActionsRequest');
    cy.intercept('GET', '/dev/shell/automaton/actions_graph').as('getActionsGraph');
    cy.visit(Cypress.config().baseUrl + '/#/state', { timeout: 10000 });
    cy.wait('@getActionsGraph');
    cy.wait('@getActionsRequest');
    cy.wait(1000);
  });

  it('[STATE MACHINE] should perform state machine diagram request successfully', () => testForTezedge(() => {
    // cy.wait('@getActionsGraph')
    //   .then((result) => {
    //     cy.wrap(result.response.statusCode).should('eq', 200);
    //   });
  }));

  it('[STATE MACHINE] should perform state machine actions request successfully', () => testForTezedge(() => {
    // cy.wait('@getActionsRequest')
    //   .then((result) => {
    //     cy.wrap(result.response.statusCode).should('eq', 200);
    //   });
  }));

  it('[STATE MACHINE] should get correct number of actions as the limit successfully', () => testForTezedge(() => {
    // cy.wait('@getActionsRequest', { timeout: 20000 })
    //   .should(result => {
    //     const url = result.response.url;
    //     const noOfActionsRequested = url.slice(url.indexOf('limit=') + 'limit='.length);
    //     cy.wrap(noOfActionsRequested).should('eq', result.response.body.length.toString());
    //   });
  }));

  it('[STATE MACHINE] should fill the last row of the table with the last value received', () => testForTezedge(() => {
    // cy.window()
    //   .its('state')
    //   .then((state) => {
    //     if (state.stateMachine.actionTable.ids.length) {
    //       cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(3) span:nth-child(2)').should('exist');
    //       const lastId = state.stateMachine.actionTable.ids.length - 1;
    //       const lastAction = state.stateMachine.actionTable.entities[lastId];
    //       if (lastAction) {
    //         cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(3) span:nth-child(2)')
    //           .then(($span) => {
    //             expect($span.text().trim()).to.equal(lastAction.kind);
    //           });
    //       }
    //     }
    //   });
    cy.window()
      .its('store')
      .then((store) => {
        store.select('stateMachine').subscribe(stateMachine => {
          if (stateMachine.actionTable.ids.length) {
            cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(3) span:nth-child(2)').should('exist');
            const lastId = stateMachine.actionTable.ids.length - 1;
            const lastAction = stateMachine.actionTable.entities[lastId];
            if (lastAction) {
              cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(3) span:nth-child(2)')
                .then(($span) => {
                  expect($span.text().trim()).to.equal(lastAction.kind);
                });
            }
          }
        });
      });
  }));

  it('[STATE MACHINE] should create rows for the virtual scroll table', () => testForTezedge(() => {
    cy.get('.virtual-scroll-container .virtualScrollRow').should('be.visible');
  }));

  it('[STATE MACHINE] should change the value of the virtual scroll element when scrolling', () => testForTezedge(() => {
    let beforeScrollValue;
    cy.window()
      .its('store')
      .then((store) => {
        store.select('stateMachine').subscribe(() => {
          cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(3) span:nth-child(2)')
            .then(($span) => {
              beforeScrollValue = $span.text();
            });

          cy.get('.virtual-scroll-container').scrollTo('top');

          cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(3) span:nth-child(2)')
            .should(($span) => {
              expect($span.text()).to.not.equal(beforeScrollValue);
            });
        });
      });
  }));

  it('[STATE MACHINE] should show properly colors for duration column values', () => testForTezedge(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('stateMachine').subscribe(stateMachine => {
          if (stateMachine.actionTable.ids.length) {
            const yellowDurationAction = stateMachine.actionTable.ids.map(id => stateMachine.actionTable.entities[id]).find(en => en.duration.includes('text-yellow'));
            const redDurationAction = stateMachine.actionTable.ids.map(id => stateMachine.actionTable.entities[id]).find(en => en.duration.includes('text-red'));

            if (yellowDurationAction) {
              const y = (yellowDurationAction.id) * 36;
              cy.get('app-state-machine-table .virtual-scroll-container.state-table').should('be.visible');
              cy.get('app-state-machine-table .virtual-scroll-container.state-table').scrollTo(0, y);
              cy.get('.virtual-scroll-container .virtualScrollRow .text-yellow')
                .then(elements => {
                  expect(yellowDurationAction.duration).to.contain(elements[0].textContent);
                });
            }
            cy.wait(1000);
            if (redDurationAction) {
              cy.get('.virtual-scroll-container').scrollTo(0, (redDurationAction.id) * 36);
              let spans;
              cy.get('.virtual-scroll-container .virtualScrollRow .text-red')
                .should(elements => spans = elements);
              cy.wrap(redDurationAction.duration).should('include', spans[0].textContent);
            }
          }
        });
      });
  }));

  it('[STATE MACHINE] should stop stream when selecting an action', () => testForTezedge(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('stateMachine').subscribe(stateMachine => {
          if (stateMachine.actionTable.ids.length) {
            cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(4)')
              .trigger('click');
            cy.wait(500);
            cy.get('.table-virtual-scroll-footer button.start-stream.inactive').should('exist');
            cy.get('.table-virtual-scroll-footer button.stop-stream:not(.inactive)').should('exist');
          }
        });
      });
  }));

  it('[STATE MACHINE] should fill the right details part with the action of the clicked row - the second last record in our case', () => testForTezedge(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('stateMachine').subscribe(stateMachine => {
          if (stateMachine.actionTable.ids.length) {
            const secondLastRecord = stateMachine.actionTable.entities[stateMachine.actionTable.ids[stateMachine.actionTable.ids.length - 2]];

            let elementFound;
            cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(4)')
              .trigger('click')
              .then(() => {
                cy.get('.ngx-json-viewer .segment-value').should(elements => {
                  elementFound = Array.from(elements).some(elem => elem.textContent.includes(secondLastRecord.originalId));
                });
                cy.wait(500).then(() => cy.wrap(elementFound).should('eq', true));
              });
          }
        });
      });
  }));

  it('[STATE MACHINE] should select correct action details tabs', () => testForTezedge(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('stateMachine').subscribe((stateMachine) => {
          if (stateMachine.actionTable.ids.length) {
            cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(4)').trigger('click');
            cy.get('app-state-machine-action-details .payload-view div div:first-child .tab').should('have.length', 3);
            cy.get('app-state-machine-action-details .payload-view div div:first-child .tab:nth-child(1):not(.active)').should('exist');
            cy.get('app-state-machine-action-details .payload-view div div:first-child .tab:nth-child(2).active').should('exist');
            cy.get('app-state-machine-action-details .payload-view div div:first-child .tab:nth-child(3):not(.active)').should('exist');

            cy.get('app-state-machine-action-details .payload-view div div:first-child .tab:nth-child(1)').trigger('click');
            cy.get('app-state-machine-action-details .payload-view div div:first-child .tab:nth-child(1).active').should('exist');
            cy.get('app-state-machine-action-details .payload-view div div:first-child .tab:nth-child(2):not(.active)').should('exist');
            cy.get('app-state-machine-action-details .payload-view div div:first-child .tab:nth-child(3):not(.active)').should('exist');

            cy.get('app-state-machine-action-details .payload-view div div:first-child .tab:nth-child(3)').trigger('click');
            cy.get('app-state-machine-action-details .payload-view div div:first-child .tab:nth-child(1):not(.active)').should('exist');
            cy.get('app-state-machine-action-details .payload-view div div:first-child .tab:nth-child(2):not(.active)').should('exist');
            cy.get('app-state-machine-action-details .payload-view div div:first-child .tab:nth-child(3).active').should('exist');
          }
        });
      });
  }));

  it('[STATE MACHINE] should show clicked action\'s diffs', () => testForTezedge(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('stateMachine').subscribe(stateMachine => {
          if (stateMachine.actionTable.ids.length) {
            cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(4)')
              .trigger('click');
            cy.wait(500).then(() => {
              cy.get('app-state-machine-action-details .payload-view div div:first-child .tab:nth-child(3)')
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
  }));

  it('[STATE MACHINE] should show clicked action\'s content', () => testForTezedge(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('stateMachine').subscribe(stateMachine => {
          if (stateMachine.actionTable.ids.length) {
            const secondLastAction = stateMachine.actionTable.entities[stateMachine.actionTable.ids[stateMachine.actionTable.ids.length - 2]];

            cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(4)')
              .trigger('click');
            cy.wait(500).then(() => {
              cy.get('app-state-machine-action-details .payload-view div div:first-child .tab:nth-child(1)')
                .trigger('click')
                .wait(300)
                .then(() => {
                  cy.get('app-state-machine-action-details .payload-view div div:first-child .tab:nth-child(1).active').should('exist');
                  cy.get('app-state-machine-action-details .payload-view div div:first-child .tab:nth-child(2):not(.active)').should('exist');

                  if (secondLastAction.content) {
                    const key0 = Object.keys(secondLastAction.content)[0];
                    if (typeof secondLastAction.content[key0] === 'string') {
                      let elementFound;
                      cy.get('.ngx-json-viewer .segment-value').should(elements => {
                        elementFound = Array.from(elements).some(elem => elem.textContent.slice(1, elem.textContent.length - 1) === secondLastAction.content[key0]);
                      });
                      cy.wait(500).then(() => cy.wrap(elementFound).should('eq', true));
                    }
                  }
                });
            });
          }
        });
      });
  }));

  it('[STATE MACHINE] should hide state chart on toggle click and show back on second click', () => testForTezedge(() => {
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
  }));

  it('[STATE MACHINE] should update local storage collapsedDiagram property when toggling the state chart', () => testForTezedge(() => {
    cy.get('#d3Diagram').then(svg => {
      if (svg.is(':visible')) {
        expect(localStorage.getItem('collapsedDiagram')).to.eq(null);
        cy.get('app-state-machine-diagram .state-toolbar .diagram-toggler')
          .trigger('click')
          .then(() => {
            expect(localStorage.getItem('collapsedDiagram')).to.eq('true');
          });
        cy.get('app-state-machine-diagram .state-toolbar .diagram-toggler')
          .trigger('click')
          .then(() => {
            expect(localStorage.getItem('collapsedDiagram')).to.eq('false');
          });
      }
    });
  }));

  it('[STATE MACHINE] should update local storage diagramHeight when dragging the resizer', () => testForTezedge(() => {
    cy.get('#d3Diagram').then(svg => {
      if (svg.is(':visible')) {
        expect(localStorage.getItem('diagramHeight')).to.eq(null);
        let diagramHeight;
        cy.get('app-state-machine .resizer-element .mid-content')
          .trigger('mousedown')
          .trigger('mousemove', { clientX: 50, clientY: 450 })
          .wait(1000)
          .trigger('mouseup')
          .wait(1000)
          .then(() => {
            diagramHeight = localStorage.getItem('diagramHeight');
            cy.wrap(diagramHeight).should('not.be.null');
            cy.wrap(Number(diagramHeight)).should('be.gt', 0);
          });
      }
    });
  }));

  it('[STATE MACHINE] should render state chart successfully', () => testForTezedge(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('stateMachine').subscribe(stateMachine => {
          if (stateMachine.diagramBlocks.length > 0) {
            cy.get('#d3Diagram svg').should('be.visible').then(svg => {
              if (svg.is(':visible')) {
                expect(svg.height()).to.be.greaterThan(0);
                expect(svg.width()).to.be.greaterThan(0);
                cy.get('#d3Diagram svg g').should('have.attr', 'transform');
                cy.get('#d3Diagram svg g .edgePaths').should('be.visible');
                cy.get('#d3Diagram svg g .edgeLabels').should('be.visible');
                cy.get('#d3Diagram svg g .nodes').should('be.visible').then(nodes => {
                  expect(nodes.children()).to.have.length(stateMachine.diagramBlocks.length);
                });
              }
            });
          }
        });
      });
  }));

  it('[STATE MACHINE] should zoom in state chart successfully on mouse wheel up', () => testForTezedge(() => {
    cy.get('#d3Diagram svg').then(svg => {
      if (svg.is(':visible')) {
        let initialTransform;
        cy.get('#d3Diagram svg > g').then((e) => {
          initialTransform = e.attr('transform');
        });
        cy.wait(500).then(() => {
          cy.get('#d3Diagram svg')
            .trigger('wheel', {
              deltaY: 500,
              wheelDelta: 12000,
              wheelDeltaX: 1000,
              wheelDeltaY: 1000,
              bubbles: true
            })
            .wait(1000)
            .then(() => {
              cy.get('#d3Diagram svg > g').then((e) => {
                expect(e.attr('transform')).not.equal(initialTransform);
              });
            });
        });
      }
    });
  }));

  it('[STATE MACHINE] should zoom in state chart successfully on plus button', () => testForTezedge(() => {
    cy.get('#d3Diagram svg').then(svg => {
      if (svg.is(':visible')) {
        let initialTransform;
        cy.get('#d3Diagram svg > g').then((e) => {
          initialTransform = e.attr('transform');
        });
        cy.wait(500).then(() => {
          cy.get('app-state-machine-diagram .zoom-group div:first-child')
            .trigger('click')
            .wait(800)
            .then(() => {
              cy.get('#d3Diagram svg > g').then((e) => {
                expect(e.attr('transform')).not.equal(initialTransform);
              });
            });
        });
      }
    });
  }));

  it('[STATE MACHINE] should zoom out state chart successfully on minus button', () => testForTezedge(() => {
    cy.get('#d3Diagram svg').then(svg => {
      if (svg.is(':visible')) {
        let initialTransform;
        cy.get('#d3Diagram svg > g').then((e) => {
          initialTransform = e.attr('transform');
        });
        cy.wait(500).then(() => {
          cy.get('app-state-machine-diagram .zoom-group div:last-child')
            .trigger('click')
            .wait(800)
            .then(() => {
              cy.get('#d3Diagram svg > g').then((e) => {
                expect(e.attr('transform')).not.equal(initialTransform);
              });
            });
        });
      }
    });
  }));

  it('[STATE MACHINE] should show whole state chart successfully on reset zoom button', () => testForTezedge(() => {
    cy.get('#d3Diagram svg').then(svg => {
      if (svg.is(':visible')) {
        let initialTransform;
        cy.get('#d3Diagram svg > g').then((e) => {
          initialTransform = e.attr('transform');
        });
        cy.wait(500).then(() => {
          cy.get('app-state-machine-diagram .zoom-group div:last-child')
            .trigger('click')
            .wait(800)
            .then(() => {
              cy.get('.full-diagram .icon-background').trigger('click')
                .wait(800)
                .then(() => {
                  cy.get('#d3Diagram svg > g').then((e) => {
                    expect(e.attr('transform')).equal(initialTransform);
                  });
                });
            });
        });
      }
    });
  }));

  it('[STATE MACHINE] should disable next and prev action buttons if no action is selected successfully', () => testForTezedge(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('stateMachine').subscribe(stateMachine => {
          if (!stateMachine.activeAction && stateMachine.actionTable.ids.length) {
            cy.get('.player-wrapper .play-pause:not(.arrows)').should('be.not.disabled');
            cy.get('.player-wrapper .play-pause.arrows:nth-child(2)').should('be.disabled');
            cy.get('.player-wrapper .play-pause.arrows:nth-child(3)').should('be.disabled');
          }
        });
      });
  }));

  it('[STATE MACHINE] should successfully start playing through the actions on play button click', () => testForTezedge(() => {
    cy.get('.virtual-scroll-container .virtualScrollRow').should('have.length.at.least', 5);
    cy.get('.virtual-scroll-container .virtualScrollRow.hover').should('not.exist');
    cy.get('.player-wrapper .play-pause:not(.arrows)')
      .trigger('click')
      .then(() => {
        let activeRowText;
        cy.get('.virtual-scroll-container .virtualScrollRow.hover span:nth-child(2)').should('exist')
          .then(span => activeRowText = span.text())
          .wait(2000)
          .then(() => {
            cy.get('.player-wrapper .play-pause:not(.arrows)')
              .trigger('click');
            cy.get('.virtual-scroll-container .virtualScrollRow.hover span:nth-child(2)').then(newSpan => {
              cy.wrap(activeRowText).should('not.eq', newSpan.text());
            });
          });
      });
  }));

  it('[STATE MACHINE] should successfully highlight correct svg block in the diagram on action click', () => testForTezedge(() => {
    cy.get('.virtual-scroll-container .virtualScrollRow').should('have.length.at.least', 5);
    cy.get('.virtual-scroll-container .virtualScrollRow:nth-last-child(4)')
      .trigger('click')
      .wait(1000);
    cy.get('.virtual-scroll-container .virtualScrollRow.hover span:nth-child(2)').should('exist')
      .then((span) => {

        cy.get('#d3Diagram svg > g g.nodes g.node.active').then(g => {
          expect(g.attr('id')).equal(span.text());
        });
        cy.get('#d3Diagram svg > g g.nodes g.node.active text tspan').then(tspan => {
          expect(tspan.text()).equal(span.text());
        });
        cy.get('#d3Diagram svg > g g.edgePaths .connection-prev').then(g => {
          cy.wrap(g.attr('id')).should('include', '-' + span.text());
        });
        cy.get('#d3Diagram svg > g g.edgePaths .connection-next').then(g => {
          cy.wrap(g.attr('id')).should('include', span.text() + '-');
        });
      });
  }));

  it('[STATE MACHINE] should successfully update progress bar on action click', () => testForTezedge(() => {
    cy.get('.virtual-scroll-container .virtualScrollRow').should('have.length.at.least', 5);
    let initialValue;
    cy.get('mat-slider').should('exist').then(slider => {
      initialValue = slider.attr('aria-valuenow');
      expect(initialValue).equal('0');
    });
    cy.get('.virtual-scroll-container')
      .scrollTo('top')
      .wait(800);
    cy.get('.virtual-scroll-container .virtualScrollRow:nth-child(4)')
      .trigger('click')
      .then(() => {
        cy.get('mat-slider').should('exist').then(slider => {
          expect(slider.attr('aria-valuenow')).not.equal(initialValue);
          expect(slider.attr('aria-valuenow')).equal('3');
        });
      });
  }));

  it('[STATE MACHINE] should successfully render filter buttons and categories', () => testForTezedge(() => {
    const categories = ['P2p', 'PeerHandshaking', 'PeerConnection', 'YieldedOperations', 'PausedLoops', 'PeersGraylist', 'PeerMessage', 'PeerBinary', 'PeerChunk', 'PeerTry', 'PeersDns', 'PeersCheck', 'Storage', 'Others'];
    cy.intercept('GET', '/dev/shell/automaton/actions_stats')
      .then(() => {
        let stats;
        cy.window()
          .its('store')
          .then((store) => {
            store.select('stateMachine').subscribe(stateMachine => {
              if (stateMachine.actionStatistics.statistics) {
                stats = stateMachine.actionStatistics.statistics.map(a => a.kind);
              }
            });
          });
        cy.wait(1000);

        cy.get('mat-expansion-panel-header').should('exist').then(() => {
          cy.get('.mat-expansion-panel-content .filters-row').should('not.exist');
          cy.get('mat-expansion-panel-header button.add-filters')
            .trigger('click', { force: true })
            .wait(1000);
          cy.get('.mat-expansion-panel-content .filters-row').should('exist');

          if (stats) {
            cy.get('.filters-row .filters-label').should('have.length.at.most', categories.length).then(labels => {
              const labelTexts = Array.from(labels).map(l => l.textContent);
              labelTexts.pop();
              labelTexts.forEach(label => {
                cy.wrap(stats.some(action => action.startsWith(label))).should('be.true');
              });
            });
            cy.get('.filters-row div div button').should('have.length', stats.length).then(filters => {
              Array.from(filters).map(f => f.textContent).forEach(text => {
                cy.wrap(stats.some(action => ' ' + action + ' ' === text)).should('be.true');
              });
            });
          }
        });
      });
  }));

  it('[STATE MACHINE] should successfully apply filters on click', () => testForTezedge(() => {
    cy.intercept('GET', '/dev/shell/automaton/actions_stats')
      .then(() => {
        cy.get('.filters-content button').should('not.exist');
        cy.get('.add-filters').trigger('click', { force: true }).wait(1000);
        cy.get('.filters-row div div button')
          .eq(-2)
          .trigger('click')
          .then(clicked => {
            cy.get('.filters-content button').should('exist').then(appliedFilter => {
              expect(appliedFilter[0].textContent).equal(clicked[0].textContent);
            });
            cy.get('.filters-row div div button')
              .eq(-4)
              .trigger('click')
              .then(() => {
                cy.get('.filters-content button').should('have.length', 2);
              });
          });
      });
  }));

  it('[STATE MACHINE] should successfully render action statistics', () => testForTezedge(() => {
    cy.intercept('GET', '/dev/shell/automaton/actions_stats')
      .then(() => {
        cy.get('app-state-machine-action-details .payload-view div div:last-child .tab')
          .trigger('click', { force: true })
          .wait(300);
        cy.get('.statistics-table').should('be.visible');
        let stats;
        cy.window()
          .its('store')
          .then((store) => {
            store.select('stateMachine').subscribe(stateMachine => {
              if (stateMachine.actionStatistics.statistics) {
                stats = stateMachine.actionStatistics.statistics;
              }
            });
          });
        cy.wait(1000);
        if (stats) {
          cy.get('.statistics-table .overflow-auto > div').should('have.length', stats.length);
        }
      });
  }));

});
