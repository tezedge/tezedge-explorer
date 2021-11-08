import { testForTezedge } from '../../support';

context('GITHUB VERSION', () => {
  beforeEach(() => {
    cy.intercept('GET', '/dev/version/').as('getNodeTagRequest')
      .intercept('GET', '/monitor/commit_hash/').as('getNodeLastCommitRequest')
      .intercept('GET', '/v2/version/').as('getDebuggerLastCommitRequest')
      .visit(Cypress.config().baseUrl);
  });

  it('[GITHUB VERSION] display the Node release tag in the UI', () => testForTezedge(() => {
    let nodeTag;
    cy.wait(2000)
      .window()
      .its('store')
      .then(store => {
        store.subscribe(state => {
          nodeTag = state.githubVersion.nodeTag.trim();
        });
      })
      .wait(3000)
      .get('.settings-node-select mat-select-trigger span')
      .then(nodeName => {
        if (!nodeName.text().includes('octez')) {
          cy.get('@getNodeTagRequest').its('response.statusCode').should('eq', 200)
            .get('.node-tag-number .pointer-none')
            .then(element => {
              expect(element.text().trim()).to.equal(nodeTag);
            });
        }
      });
  }));

  it('[GITHUB VERSION] display Node anchor with an url to the last commit, when click on the Node Tag', () => testForTezedge(() => {
    cy.wait(2000)
      .get('@getNodeLastCommitRequest').its('response.statusCode').should('eq', 200)
      .window()
      .its('store')
      .then(store => {
        store.select('githubVersion').subscribe((githubVersion) => {
          cy.get('app-github-version')
            .trigger('click')
            .wait(1000)
            .get('#nodeCommit')
            .find('a')
            .should('have.attr', 'href', 'https://github.com/tezedge/tezedge/commit/' + githubVersion.nodeCommit);
        });
      });
  }));

  it('[GITHUB VERSION] perform Debugger last commit request successfully', () => testForTezedge(() => {
    cy.wait('@getDebuggerLastCommitRequest')
      .its('response.statusCode')
      .should('eq', 200);
  }));

  it('[GITHUB VERSION] display Debugger anchor with an url to the last commit, when click on the Node Tag', () => testForTezedge(() => {
    let nodeDebuggerCommit;
    cy.wait(1000)
      .window()
      .its('store')
      .then(store => {
        store.subscribe(data => {
          nodeDebuggerCommit = data.githubVersion.debuggerCommit;
        });
      })
      .wait(2000)
      .get('app-github-version .node-tag-number')
      .click()
      .wait(1500)
      .then(() => {
        if (nodeDebuggerCommit) {
          cy.get('#debuggerCommit')
            .find('a')
            .should('have.attr', 'href', 'https://github.com/tezedge/tezedge-debugger/commit/' + nodeDebuggerCommit);
        }
      });
  }));

  it('[GITHUB VERSION] display the Explorer last commit number in the UI', () => testForTezedge(() => {
    let explorerCommit;
    cy.wait(1000)
      .window()
      .its('store')
      .then(store => {
        store.subscribe(data => {
          if (data.githubVersion.explorerCommit.length) {
            explorerCommit = data.githubVersion.explorerCommit;
          }
        });
      })
      .wait(2000)
      .get('.settings-node-select mat-select-trigger span')
      .then(() => {
        if (explorerCommit) {
          cy.get('app-github-version')
            .trigger('click')
            .wait(1000)
            .get('#explorerCommit')
            .find('a')
            .should('have.attr', 'href', 'https://github.com/tezedge/tezedge-explorer/commit/' + explorerCommit);
        }
      });
  }));
});
