context('MEMORY RESOURCES', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
    cy.wait(1000);
    cy.visit(Cypress.config().baseUrl + '/#/resources/memory', { timeout: 10000 });
    cy.intercept('GET', '/v1/tree*').as('getMemoryResources');
    cy.wait(1000);
  });

  it('[MEMORY RESOURCES] should perform get memory resources request successfully', () => {
    cy.wait('@getMemoryResources').its('response.statusCode').should('eq', 200);
  });

  it('[MEMORY RESOURCES] should parse tree RPC response successfully', () => {
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('resources').subscribe(store => {
            const resources = store.memoryResources;
            cy.wrap(resources).should('not.be.undefined');
            cy.wrap(resources.name.executableName).should('eq', 'root');
            cy.wrap(resources.value).should('not.be.undefined');

            const recursiveAssertion = (children) => {
              children.forEach(child => {
                cy.wrap(child.name.executableName).should('not.be.undefined');
                cy.wrap(child.value).should('not.be.undefined');
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
                cy.wrap(child.color).should('eq', expectedColor);

                if (child.children && child.children.length > 1) {
                  const isArraySortedBySize = (child) => {
                    for (let i = 0; i < child.children.length - 1; i++) {
                      if (child.children[i].value < child.children[i + 1].value) {
                        return false;
                      }
                    }
                    return true;
                  };

                  cy.wrap(isArraySortedBySize(child)).should('eq', true);

                  recursiveAssertion(child.children);
                }
              });
            };

            recursiveAssertion(resources.children);
          });
        });
    });
  });

  it('[MEMORY RESOURCES] should render memory resources table successfully', () => {
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('resources').subscribe(root => {
            cy.get('table.memory-table', { timeout: 10000 }).should('be.visible');
            cy.get('table.memory-table tbody tr')
              .should((trArray) => {
                expect(trArray).to.have.length(root.memoryResources.children.length);
              });
          });
        });
    });
  });

  it('[MEMORY RESOURCES] should render treemap successfully', () => {
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('resources').subscribe(root => {
            cy.wait(1000);
            cy.get('.tree-map.observablehq svg', { timeout: 10000 }).should('be.visible');
            cy.get('.tree-map.observablehq svg > g > g')
              .should((trArray) => {
                expect(trArray).to.have.length(root.memoryResources.children.length);
              });
          });
        });
    });
  });

  it('[MEMORY RESOURCES] should zoom in on table\'s second row click successfully', () => {
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('resources').subscribe(root => {
            if (root.memoryResources.children[1].children.length) {
              cy.wait(2000);
              cy.get('table.memory-table tbody tr:nth-child(2)', { timeout: 10000 }).click();
              cy.wait(2000);
              root.memoryResources.children[1].children.forEach((child, i) => {
                cy.get(`table.memory-table tbody tr:nth-child(${i + 1}) td:nth-child(3) div span`, { timeout: 10000 })
                  .should(span => {
                    expect(span.text()).to.equal(child.name.executableName);
                  });

                cy.get('.tree-map.observablehq svg g text tspan')
                  .should(tSpans => {
                    const tSpanArray = [];
                    tSpans.each(i => {
                      tSpanArray.push(tSpans[i]);
                    });
                    expect(tSpanArray.some(tSpan => tSpan.innerHTML === child.name.executableName)).to.be.true;
                  });
              });

              cy.get('.active-resources span')
                .should(span => {
                  expect(span.text()).to.contains(root.memoryResources.children[1].name.executableName);
                });
            }
          });
        });
    });
  });

  it('[MEMORY RESOURCES] should update breadcrumbs successfully when zoom in on table\'s first row click', () => {
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          cy.wait(1000).then(() => {
            store.select('resources').subscribe(res => {
              if (res.memoryResources.children[0].children.length) {
                cy.wait(2000);
                cy.get('table.memory-table tbody tr:nth-child(1)', { timeout: 10000 }).click();
                cy.wait(2000);

                cy.get('.breadcrumbs > :nth-last-child(2)')
                  .should(div => {
                    expect(div.text()).to.equal(res.memoryResources.children[0].name.executableName);
                  });
              }
            });
          });
        });
    });
  });

  it('[MEMORY RESOURCES] should update table successfully when click on breadcrumb', () => {
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('resources').subscribe(root => {
            if (root.memoryResources.children[0].children.length) {
              cy.wait(2000);
              cy.get('table.memory-table tbody tr:nth-child(1)', { timeout: 10000 }).click();
              cy.wait(2000);

              cy.get(`table.memory-table tbody tr:nth-child(1) td:nth-child(3) div span`)
                .should(span => {
                  expect(span.text()).to.equal(root.memoryResources.children[0].children[0].name.executableName);
                });

              cy.get('.breadcrumbs .breadcrumb:nth-child(1)').click();
              cy.wait(1000);
              cy.get(`table.memory-table tbody tr:nth-child(1) td:nth-child(3) div span`)
                .should(span => {
                  expect(span.text()).to.equal(root.memoryResources.children[0].name.executableName);
                });
            }
          });
        });
    });
  });

  it('[MEMORY RESOURCES] should zoom in on treemap block click', () => {
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('resources').subscribe(root => {
            if (root.memoryResources.children[0].children.length) {
              const clicked = root.memoryResources.children[0];
              cy.wait(2000);
              cy.get('.tree-map.observablehq svg g > g:first-child', { timeout: 10000 }).click();
              cy.wait(1000);


              cy.get('.active-resources span')
                .should(span => {
                  expect(span.text()).to.contains(clicked.name.executableName);
                });

              cy.get('.tree-map.observablehq svg > g > g text tspan')
                .should((tspan) => {
                  expect(tspan.text()).to.contains(clicked.children[0].name.executableName);
                });

              cy.get(`table.memory-table tbody tr:nth-child(1) td:nth-child(3) div span`)
                .should(span => {
                  expect(span.text()).to.equal(clicked.children[0].name.executableName);
                });
            }
          });
        });
    });
  });

  it('[MEMORY RESOURCES] should show tooltip on hover the treemap\'s second block', () => {
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('resources').subscribe(root => {
            if (root.memoryResources.children.length > 1 && root.memoryResources.children[0].children.length) {
              const hovered = root.memoryResources.children[1];
              cy.wait(2000);
              cy.get('.tree-map.observablehq svg g > g:nth-child(2)', { timeout: 10000 }).trigger('mouseover');
              cy.wait(1000);


              cy.get('.d3-tooltip').should('be.visible');

              cy.get('.d3-tooltip div:first-child')
                .should((div) => {
                  expect(div.text()).to.contains('/' + hovered.name.executableName);
                });

              cy.get('.d3-tooltip div:nth-child(2)')
                .should((div) => {
                  expect(div.text()).to.contains(hovered.children.length + ' children');
                });
            }
          });
        });
    });
  });

  it('[MEMORY RESOURCES] should zoom out one step on back button click successfully', () => {
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('resources').subscribe(root => {
            if (root.memoryResources.children[0].children.length) {
              const clicked = root.memoryResources.children[0];
              cy.wait(2000);
              cy.get('.tree-map.observablehq svg g > g:first-child', { timeout: 10000 }).click();
              cy.wait(1000);

              cy.get('.active-resources span')
                .should(span => {
                  expect(span.text()).to.contains(clicked.name.executableName);
                });
              cy.get('.active-resources div.pointer').click();
              cy.wait(1000);
              cy.get('.tree-map.observablehq svg > g > g text tspan')
                .should((tspan) => {
                  expect(tspan.text()).to.contains(clicked.name.executableName);
                });

              cy.get(`table.memory-table tbody tr:nth-child(1) td:nth-child(3) div span`)
                .should(span => {
                  expect(span.text()).to.equal(clicked.name.executableName);
                });
            }
          });
        });
    });
  });

});
