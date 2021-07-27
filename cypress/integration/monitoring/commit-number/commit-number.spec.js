const isOctez = (data) => data.settingsNode.activeNode.type === 'octez';

context('COMMIT NUMBER', () => {
  it('[COMMIT NUMBER] display the Node release tag in the UI', () => {
    cy.intercept('GET', '/dev/version/').as('getNodeTagRequest');
    cy.visit(Cypress.config().baseUrl);
    let nodeTag;
    cy.wait(2000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.subscribe(state => {
            if (nodeTag) {
              return false;
            }

            if (!isOctez(state)) {
              nodeTag = state.commitNumber.nodeTag.trim();
            }
          });
        });
    });

    cy.wait(3000).then(() => {
      cy.get('.settings-node-select mat-select-trigger span').then(nodeName => {
        if (!nodeName.text().includes('octez')) {
          cy.get('@getNodeTagRequest').its('response.statusCode').should('eq', 200)
            .then(() => {
              cy.get('.node-tag-number-and-icon')
                .should(($element) => {
                  expect($element.text().trim()).to.equal(nodeTag);
                });
            });
        }
      });
    });
  });

  it('[COMMIT NUMBER] display Node anchor with an url to the last commit, when click on the Node Tag', () => {
    cy.intercept('GET', '/monitor/commit_hash/').as('getNodeLastCommitRequest');
    cy.visit(Cypress.config().baseUrl);
    cy.wait(2000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.subscribe(data => {
            if (!isOctez(data)) {
              cy.get('@getNodeLastCommitRequest').its('response.statusCode').should('eq', 200).then(() => {
                cy.wait(2000).then(() => {
                  store.select('commitNumber')
                    .subscribe((commitNumber) => {
                      cy.get('app-commit-number')
                        .trigger('click')
                        .then(() => {
                          cy.wait(1000).then(() => {
                            cy.get('#nodeCommit')
                              .find('a')
                              .should('have.attr', 'href', 'https://github.com/tezedge/tezedge/commit/' + commitNumber.nodeCommit);
                          });
                        });
                    });
                });
              });
            }
          });
        });
    });
  });

  it('[COMMIT NUMBER] perform Debugger last commit request successfully', () => {
    cy.intercept('GET', '/v2/version/').as('getDebuggerLastCommitRequest');
    cy.visit(Cypress.config().baseUrl);

    cy.wait(1000).then(() => {
      cy.get('.settings-node-select mat-select-trigger span').then(nodeName => {
        if (!nodeName.text().includes('octez')) {
          cy.wait('@getDebuggerLastCommitRequest')
            .its('response.statusCode')
            .should('eq', 200);
        }
      });
    });
  });

  it('[COMMIT NUMBER] display Debugger anchor with an url to the last commit, when click on the Node Tag', () => {
    cy.visit(Cypress.config().baseUrl);
    let nodeDebuggerCommit;
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.subscribe(data => {
            if (!isOctez(data)) {
              nodeDebuggerCommit = data.commitNumber.debuggerCommit;
            }
          });
        });
    });

    cy.wait(2000).then(() => {
      cy.get('.settings-node-select mat-select-trigger span').then(nodeName => {
        if (!nodeName.text().includes('octez')) {
          cy.get('app-commit-number .node-tag-number')
            .click()
            .then(() => {
              cy.wait(1500).then(() => {
                if (nodeDebuggerCommit) {
                  cy.get('#debuggerCommit')
                    .find('a')
                    .should('have.attr', 'href', 'https://github.com/tezedge/tezedge-debugger/commit/' + nodeDebuggerCommit);
                }
              });
            });
        }
      });
    });
  });

  it('[COMMIT NUMBER] display the Explorer last commit number in the UI', () => {
    cy.visit(Cypress.config().baseUrl);
    let explorerCommit;
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.subscribe(data => {
            if (!isOctez(data)) {
              if (data.commitNumber.explorerCommit.length) {
                explorerCommit = data.commitNumber.explorerCommit;
              }
            } else {
              return false;
            }
          });
        });
    });

    cy.wait(2000).then(() => {
      cy.get('.settings-node-select mat-select-trigger span').then(nodeName => {
        if (!nodeName.text().includes('octez') && explorerCommit) {
          cy.get('app-commit-number')
            .trigger('click')
            .then(() => {
              cy.wait(1000).then(() => {
                cy.get('#explorerCommit')
                  .find('a')
                  .should('have.attr', 'href', 'https://github.com/tezedge/tezedge-explorer/commit/' + explorerCommit);
              });
            });
        }
      });
    });
  });
});
