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
            cy.wrap(resources.cacheValue).should('not.be.undefined');
            cy.wrap(resources.value).should('not.be.undefined');
            cy.wrap(resources.total).should('eq', resources.value + resources.cacheValue);

            const recursiveAssertion = (children) => {
              children.forEach(child => {
                cy.wrap(child.name.executableName).should('not.be.undefined');
                cy.wrap(child.name.functionCategory).should('not.be.undefined');
                cy.wrap(child.cacheValue).should('not.be.undefined');
                cy.wrap(child.value).should('not.be.undefined');
                cy.wrap(child.total).should('eq', child.value + child.cacheValue);
                let expectedColor;
                if (child.value > 999999) {
                  expectedColor = '#eb5368';
                } else if (child.value > 99999) {
                  expectedColor = '#555558';
                } else if (child.value > 9999) {
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
            cy.get('table.memory-table').should('be.visible');
            cy.get('table.memory-table tbody tr')
              .should((trArray) => {
                expect(trArray).to.have.length(root.memoryResources.children.length);
              });
          });
        });
    });
  });

  it('[MEMORY RESOURCES] should zoom in successfully to selected entry on table\'s second row click', () => {
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.select('resources').subscribe(root => {
            if (root.memoryResources.children[1].children.length) {
              cy.wait(2000);
              cy.get('table.memory-table tbody tr:nth-child(2)').click();
              cy.wait(2000);
              root.memoryResources.children[1].children.forEach((child, i) => {
                cy.get(`table.memory-table tbody tr:nth-child(${i + 1}) td:nth-child(3) div span`)
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


});
