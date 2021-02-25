context('commit-number', () => {
	beforeEach(() => {
		cy.intercept('GET', '/dev/version').as('getNodeTagRequest');
		cy.intercept('GET', '/v2/version').as('getDebuggerLastCommitRequest');
		cy.intercept('GET', '/monitor/commit_hash').as('getNodeLastCommitRequest');
		cy.visit(Cypress.config().baseUrl);
	})

	it('[commit-number] perform Node tag request successfully', () => {
		cy.wait('@getNodeTagRequest').its('response.statusCode').should('eq', 200);
	})

	it('[commit-number] display the Node release tag in the UI', () => {
		cy.wait('@getNodeTagRequest')
			.then(() => {
				cy.window()
					.its('store')
					.then((store) => {
						store.select('commitNumber')
							.subscribe((data) => {
								cy.get('.node-tag-number-and-icon')
									.should(($element) => {
										expect($element.text().trim()).to.equal(data.nodeTag.trim());
									})

							})
					})
			})
	})

	it('[commit-number] perform Node last commit request successfully', () => {
		cy.wait('@getNodeLastCommitRequest').its('response.statusCode').should('eq', 200);
	})

	it('[commit-number] display Node anchor with an url to the last commit, when hover on the Node Tag', () => {
		cy.wait('@getNodeLastCommitRequest')
			.then(() => {
				cy.window()
					.its('store')
					.then((store) => {
						store.select('commitNumber')
							.subscribe((data) => {
								cy.get('app-commit-number')
									.trigger('mouseenter')
									.then(() => {
										cy.wait(1000);
										cy.get('#nodeCommit')
											.find('a')
											.should('have.attr', 'href', 'https://github.com/simplestaking/tezedge/commit/' + data.nodeCommit)
									})
							})
					})
			})
	})

	it('[commit-number] perform Debugger last commit request successfully', () => {
		cy.wait('@getDebuggerLastCommitRequest').its('response.statusCode').should('eq', 200);
	})

	it('[commit-number] display Debugger anchor with an url to the last commit, when hover on the Node Tag', () => {
		cy.wait('@getNodeLastCommitRequest')
			.then(() => {
				cy.window()
					.its('store')
					.then((store) => {
						store.select('commitNumber')
							.subscribe((data) => {
								cy.get('app-commit-number')
									.trigger('mouseenter')
									.then(() => {
										cy.wait(1000);
										cy.get('#debuggerCommit')
											.find('a')
											.should('have.attr', 'href', 'https://github.com/simplestaking/tezedge-debugger/commit/' + data.debuggerCommit)
									})
							})
					})
			})
	})

	it('[commit-number] display the Explorer last commit number in the UI', () => {
		cy.wait(1000)
			.then(() => {
				cy.window()
					.its('store')
					.then((store) => {
						store.select('commitNumber')
							.subscribe((data) => {
							  if (data.explorerCommit.length) {
                  cy.get('app-commit-number')
                    .trigger('mouseenter')
                    .then(() => {
                      cy.wait(1000);
                      cy.get('#explorerCommit')
                        .find('a')
                        .should('have.attr', 'href', 'https://github.com/simplestaking/tezedge-explorer/commit/' + data.explorerCommit)
                    })
                } else {
							    return true;
                }

							})
					})
			})

	})


})
