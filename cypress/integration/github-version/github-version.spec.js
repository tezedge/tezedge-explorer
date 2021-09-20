const isOctez = (data) => data.settingsNode.activeNode.type === 'octez';

context('GITHUB VERSION', () => {
  it('[GITHUB VERSION] display the Node release tag in the UI', () => {
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
              nodeTag = state.githubVersion.nodeTag.trim();
            }
          });
        });
    });

    cy.wait(3000).then(() => {
      cy.get('.settings-node-select mat-select-trigger span').then(nodeName => {
        if (!nodeName.text().includes('octez')) {
          cy.get('@getNodeTagRequest').its('response.statusCode').should('eq', 200)
            .then(() => {
              cy.get('.node-tag-number .pointer-none')
                .should(($element) => {
                  expect($element.text().trim()).to.equal(nodeTag);
                });
            });
        }
      });
    });
  });

  it('[GITHUB VERSION] display Node anchor with an url to the last commit, when click on the Node Tag', () => {
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
                  store.select('githubVersion').subscribe((githubVersion) => {
                    cy.get('app-github-version')
                      .trigger('click')
                      .then(() => {
                        cy.wait(1000).then(() => {
                          cy.get('#nodeCommit')
                            .find('a')
                            .should('have.attr', 'href', 'https://github.com/tezedge/tezedge/commit/' + githubVersion.nodeCommit);
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

  it('[GITHUB VERSION] perform Debugger last commit request successfully', () => {
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

  it('[GITHUB VERSION] display Debugger anchor with an url to the last commit, when click on the Node Tag', () => {
    cy.visit(Cypress.config().baseUrl);
    let nodeDebuggerCommit;
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.subscribe(data => {
            if (!isOctez(data)) {
              nodeDebuggerCommit = data.githubVersion.debuggerCommit;
            }
          });
        });
    });

    cy.wait(2000).then(() => {
      cy.get('.settings-node-select mat-select-trigger span').then(nodeName => {
        if (!nodeName.text().includes('octez')) {
          cy.get('app-github-version .node-tag-number')
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

  it('[GITHUB VERSION] display the Explorer last commit number in the UI', () => {
    cy.visit(Cypress.config().baseUrl);
    let explorerCommit;
    cy.wait(1000).then(() => {
      cy.window()
        .its('store')
        .then((store) => {
          store.subscribe(data => {
            if (!isOctez(data)) {
              if (data.githubVersion.explorerCommit.length) {
                explorerCommit = data.githubVersion.explorerCommit;
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
          cy.get('app-github-version')
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
