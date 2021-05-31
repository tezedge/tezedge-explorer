import { onlyOn } from '@cypress/skip-test';

const isOcaml = (data) => data.settingsNode.activeNode.id.includes('ocaml');

context('commit-number', () => {
  beforeEach(() => {
    cy.intercept('GET', '*/dev/*').as('getNodeTagRequest');
    cy.intercept('GET', '*/v2/*').as('getDebuggerLastCommitRequest');
    cy.intercept('GET', '*/monitor/commit_hash*').as('getNodeLastCommitRequest');
    cy.visit(Cypress.config().baseUrl);
    cy.wait(2000);
  });

  // it('[commit-number] perform Node tag request successfully', () => {
    // cy.window()
    //   .its('store')
    //   .then((store) => {
    //     store.subscribe(data => {
    //       if (isOcaml(data)) {
    //         onlyOn(false);
    //       } else {
    //         cy.wait('@getNodeTagRequest').its('response.statusCode').should('eq', 200);
      //     }
      //   });
      // });
  // });
/*
  it('[commit-number] display the Node release tag in the UI', () => {
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(data => {
          if (isOcaml(data)) {
            onlyOn(false);
          } else {
            cy.wait('@getNodeTagRequest')
              .then(() => {
                store.select('commitNumber')
                  .subscribe((data) => {
                    cy.get('.node-tag-number-and-icon')
                      .should(($element) => {
                        expect($element.text().trim()).to.equal(data.nodeTag.trim());
                      });
                  });
              });
          }
        });
      });
  });

  it('[commit-number] perform Node last commit request successfully', () => {
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(data => {
          if (isOcaml(data)) {
            onlyOn(false);
          } else {
            cy.wait('@getNodeLastCommitRequest').its('response.statusCode').should('eq', 200);
          }
        });
      });
  });

  it('[commit-number] display Node anchor with an url to the last commit, when click on the Node Tag', () => {
    cy.wait('@getNodeLastCommitRequest')
      .then(() => {
        cy.window()
          .its('store')
          .then((store) => {
            store.subscribe(data => {
              if (isOcaml(data)) {
                onlyOn(false);
              } else {
                store.select('commitNumber')
                  .subscribe((commitNumber) => {
                    cy.get('app-commit-number')
                      .trigger('click')
                      .then(() => {
                        cy.wait(1000);
                        cy.get('#nodeCommit')
                          .find('a')
                          .should('have.attr', 'href', 'https://github.com/simplestaking/tezedge/commit/' + commitNumber.nodeCommit);
                      });
                  });
              }
            });
          });
      });
  });

  it('[commit-number] perform Debugger last commit request successfully', () => {
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(data => {
          if (isOcaml(data)) {
            onlyOn(false);
          } else {
            cy.wait('@getDebuggerLastCommitRequest').its('response.statusCode').should('eq', 200);
          }
        });
      });
  });

  it('[commit-number] display Debugger anchor with an url to the last commit, when click on the Node Tag', () => {
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(data => {
          if (isOcaml(data)) {
            onlyOn(false);
          } else {
            cy.wait('@getNodeLastCommitRequest')
              .then(() => {
                store.select('commitNumber')
                  .subscribe((data) => {
                    cy.get('app-commit-number')
                      .trigger('click')
                      .then(() => {
                        cy.wait(1500);
                        if (data.debuggerCommit) {
                          cy.get('#debuggerCommit')
                            .find('a')
                            .should('have.attr', 'href', 'https://github.com/simplestaking/tezedge-debugger/commit/' + data.debuggerCommit);
                        }
                      });
                  });
              });
          }
        });
      });
  });

  it('[commit-number] display the Explorer last commit number in the UI', () => {
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(data => {
          if (isOcaml(data)) {
            onlyOn(false);
          } else {
            cy.wait(1000)
              .then(() => {
                store.select('commitNumber')
                  .subscribe((data) => {
                    if (data.explorerCommit.length) {
                      cy.get('app-commit-number')
                        .trigger('click')
                        .then(() => {
                          cy.wait(1000);
                          cy.get('#explorerCommit')
                            .find('a')
                            .should('have.attr', 'href', 'https://github.com/simplestaking/tezedge-explorer/commit/' + data.explorerCommit);
                        });
                    } else {
                      return true;
                    }
                  });
              });
          }
        });
      });
  });*/
});
