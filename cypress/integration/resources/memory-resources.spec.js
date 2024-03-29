const beforeMemoryResourcesTest = (test) => {
  let tested = false;
  cy.visit(Cypress.config().baseUrl + '/#/resources/memory', { timeout: 100000 })
    .wait(1000)
    .window()
    .its('store')
    .then({ timeout: 10500 }, store => {
      return new Cypress.Promise((resolve) => {
        setTimeout(() => resolve(), 10000);
        store.subscribe(state => {
          console.log(state.resources.memoryResourcesState.memoryResources);
          if (!tested && state.resources.memoryResourcesState.memoryResources) {
            tested = true;
            test();
            resolve();
          }
        });
      });
    });
};

context('MEMORY RESOURCES', () => {

  it('[MEMORY RESOURCES] should have status code 200 for memory resources request', () => beforeMemoryResourcesTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          cy.request(settingsNode.activeNode.features.find(f => f.name === 'resources/memory').memoryProfilerUrl + '/v1/tree?threshold=100')
            .its('status')
            .should('eq', 200);
        });
      });
  }));

  it('[MEMORY RESOURCES] should parse tree RPC response', () => beforeMemoryResourcesTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('resources').subscribe(state => {
          const resources = state.memoryResourcesState.memoryResources;
          if (resources) {
            expect(resources).to.not.be.undefined;
            expect(resources.name.executableName).to.equal('root');
            expect(resources.value).to.not.be.undefined;

            const recursiveAssertion = (children) => {
              children.forEach(child => {
                expect(child.name.executableName).to.not.be.undefined;
                expect(child.value).to.not.be.undefined;
                let expectedColor;
                if (child.value > 99.99) {
                  expectedColor = '#793541';
                } else if (child.value > 49.99) {
                  expectedColor = '#555558';
                } else if (child.value > 9.99) {
                  expectedColor = '#3f3f43';
                } else {
                  expectedColor = '#2a2a2e';
                }
                expect(child.color).to.equal(expectedColor);

                if (child.children && child.children.length > 1) {
                  const isArraySortedBySize = (child) => {
                    for (let i = 0; i < child.children.length - 1; i++) {
                      if (child.children[i].value < child.children[i + 1].value) {
                        return false;
                      }
                    }
                    return true;
                  };

                  expect(isArraySortedBySize(child)).to.be.true;

                  recursiveAssertion(child.children);
                }
              });
            };

            recursiveAssertion(resources.children);
          }
        });
      });
  }));

  it('[MEMORY RESOURCES] should render memory resources table', () => beforeMemoryResourcesTest(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('resources').subscribe(root => {
          cy.get('table.memory-table', { timeout: 10000 }).should('be.visible');

          if (root.memoryResourcesState.memoryResources.children.length) {
            cy.get('table.memory-table tbody tr')
              .then(trArray => {
                if (root.memoryResourcesState.memoryResources) {
                  expect(trArray).to.have.length(root.memoryResourcesState.memoryResources.children.length);
                }
              });
          }
        });
      });
  }));

  it('[MEMORY RESOURCES] should render the treemap graph', () => beforeMemoryResourcesTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('resources').subscribe(root => {
          if (root.memoryResourcesState.memoryResources.children.length) {
            cy.wait(1000)
              .get('.tree-map.observablehq svg', { timeout: 10000 }).should('be.visible')
              .get('.tree-map.observablehq svg > g > g')
              .then(gArray => {
                if (root.memoryResourcesState.memoryResources) {
                  expect(gArray).to.have.length(root.memoryResourcesState.memoryResources.children.length);
                }
              });
          }
        });
      });
  }));

  it('[MEMORY RESOURCES] should zoom in on table\'s second row click', () => beforeMemoryResourcesTest(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('resources').subscribe(root => {
          if (root.memoryResourcesState.memoryResources.children[1].children.length) {
            cy.wait(2000)
              .get('table.memory-table tbody tr:nth-child(2)', { timeout: 10000 })
              .click({ force: true })
              .wait(2000)
              .then(() => {
                root.memoryResourcesState.memoryResources.children[1].children.forEach((child, i) => {
                  cy.get(`table.memory-table tbody tr:nth-child(${i + 1}) td:nth-child(3) div span`, { timeout: 10000 })
                    .then(span => {
                      expect(span.text()).to.equal(child.name.executableName);
                    })

                    .get('.tree-map.observablehq svg g text tspan')
                    .then(tSpans => {
                      const tSpanArray = [];
                      tSpans.each(i => {
                        tSpanArray.push(tSpans[i]);
                      });
                      expect(tSpanArray.some(tSpan => tSpan.innerHTML === child.name.executableName)).to.be.true;
                    });
                });
              })
              .get('.active-resources span')
              .then(span => {
                expect(span.text()).to.contains(root.memoryResourcesState.memoryResources.children[1].name.executableName);
              });
          }
        });
      });
  }));

  it('[MEMORY RESOURCES] should update breadcrumbs when zoom in on table\'s first row click', () => beforeMemoryResourcesTest(() => {
    cy.wait(1000)
      .window()
      .its('store')
      .then((store) => {
        store.select('resources').subscribe(res => {
          if (res.memoryResourcesState.memoryResources.children[0]?.children.length) {
            cy.wait(1000)
              .get('table.memory-table tbody tr:nth-child(1)', { timeout: 10000 })
              .click({ force: true })
              .wait(2000)

              .get('.breadcrumbs > :nth-last-child(2)')
              .then(div => {
                expect(div.text()).to.equal(res.memoryResourcesState.memoryResources.children[0].name.executableName);
              });
          }
        });
      });
  }));

  it('[MEMORY RESOURCES] should update table when click on breadcrumb', () => beforeMemoryResourcesTest(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('resources').subscribe(root => {
          if (root.memoryResourcesState.memoryResources.children[0].children.length) {
            cy.wait(1000)
              .get('table.memory-table tbody tr:nth-child(1)', { timeout: 10000 })
              .click({ force: true })
              .wait(2000)

              .get(`table.memory-table tbody tr:nth-child(1) td:nth-child(3) div span`)
              .then(span => {
                expect(span.text()).to.equal(root.memoryResourcesState.memoryResources.children[0].children[0].name.executableName);
              })

              .get('.breadcrumbs .breadcrumb:nth-child(1)')
              .click({ force: true })
              .wait(1000)
              .get(`table.memory-table tbody tr:nth-child(1) td:nth-child(3) div span`)
              .then(span => {
                expect(span.text()).to.equal(root.memoryResourcesState.memoryResources.children[0].name.executableName);
              });
          }
        });
      });
  }));

  it('[MEMORY RESOURCES] should zoom in on treemap block click', () => beforeMemoryResourcesTest(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('resources').subscribe(root => {
          if (root.memoryResourcesState.memoryResources.children[0].children.length) {
            const clicked = root.memoryResourcesState.memoryResources.children[0];
            cy.wait(2000)
              .get('.tree-map.observablehq svg g > g:first-child', { timeout: 10000 })
              .click({ force: true })
              .wait(1000)

              .get('.active-resources span')
              .then(span => {
                expect(span.text()).to.contains(clicked.name.executableName);
              })

              .get('.tree-map.observablehq svg > g > g text tspan')
              .then(tspan => {
                expect(tspan.text()).to.contains(clicked.children[0].name.executableName);
              })

              .get(`table.memory-table tbody tr:nth-child(1) td:nth-child(3) div span`)
              .then(span => {
                expect(span.text()).to.equal(clicked.children[0].name.executableName);
              });
          }
        });
      });
  }));

  it('[MEMORY RESOURCES] should show tooltip on hover the treemap\'s second block', () => beforeMemoryResourcesTest(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('resources').subscribe(root => {
          if (root.memoryResourcesState.memoryResources?.children.length > 1 && root.memoryResourcesState.memoryResources.children[0].children.length) {
            const hovered = root.memoryResourcesState.memoryResources.children[1];
            const isResourceBigEnough = (hovered.value / root.memoryResourcesState.memoryResources.value * 100) > 0;
            if (isResourceBigEnough) {
              cy.wait(1000)
                .get('.tree-map.observablehq svg g > g:nth-child(2)', { timeout: 10000 })
                .trigger('mouseover')
                .wait(1000)

                .get('.d3-tooltip').should('be.visible')

                .get('.d3-tooltip div:first-child')
                .then((div) => {
                  expect(div.text()).to.contains('/' + hovered.name.executableName);
                })

                .get('.d3-tooltip div:nth-child(2)')
                .then((div) => {
                  expect(div.text()).to.contains(hovered.children.length + ' children');
                });
            }
          }
        });
      });
  }));

  it('[MEMORY RESOURCES] should zoom out one step on back button click', () => beforeMemoryResourcesTest(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('resources').subscribe(root => {
          if (root.memoryResourcesState.memoryResources.children[0].children.length) {
            const clicked = root.memoryResourcesState.memoryResources.children[0];
            cy.wait(2000)
              .get('.tree-map.observablehq svg g > g:first-child', { timeout: 10000 })
              .click({ force: true })
              .wait(1000)
              .get('.active-resources span')
              .then(span => {
                expect(span.text()).to.contains(clicked.name.executableName);
              })
              .get('.active-resources div.pointer').click()
              .wait(1000)
              .get('.tree-map.observablehq svg > g > g text tspan')
              .then((tspan) => {
                expect(tspan.text()).to.contains(clicked.name.executableName);
              })

              .get(`table.memory-table tbody tr:nth-child(1) td:nth-child(3) div span`)
              .then(span => {
                expect(span.text()).to.equal(clicked.name.executableName);
              });
          }
        });
      });
  }));

});
