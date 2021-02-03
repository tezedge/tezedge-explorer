context('commit-number', () => {
	beforeEach(() => {
		cy.intercept('GET', '/v2/version').as('getDebuggerLastCommitRequest');
		cy.intercept('GET', '/monitor/commit_hash').as('getNodeLastCommitRequest');
		cy.visit(Cypress.config().baseUrl);
	})

	it('[commit-number] perform Node last commit request successfully', () => {
		cy.wait('@getNodeLastCommitRequest').its('response.statusCode').should('eq', 200);
	})

	it('[commit-number] display the Node last commit number in the UI', () => {
		cy.wait('@getNodeLastCommitRequest')
			.then(() => {
				cy.window()
					.its('store')
					.then((store) => {
						store.select('commitNumber')
							.subscribe((data) => {
								cy.get('#nodeCommit')
									.should(($element) => {
										expect($element.text().trim()).to.equal('Node: ' + data.nodeCommit.trim());
									})

							})
					})
			})
	})

	it('[commit-number] perform Debugger last commit request successfully', () => {
		cy.wait('@getDebuggerLastCommitRequest').its('response.statusCode').should('eq', 200);
	})

	it('[commit-number] display the Debugger last commit number in the UI', () => {
		cy.wait('@getDebuggerLastCommitRequest')
			.then(() => {
				cy.window()
					.its('store')
					.then((store) => {
						store.select('commitNumber')
							.subscribe((data) => {
								cy.get('#debuggerCommit')
									.should(($element) => {
										expect($element.text().trim()).to.equal('Debugger: ' + data.debuggerCommit.trim());
									})

							})
					})
			})
	})

	it('[commit-number] display the Debugger last commit number in the UI', () => {
		cy.wait(1000)
			.then(() => {
				cy.window()
					.its('store')
					.then((store) => {
						store.select('commitNumber')
							.subscribe((data) => {
								cy.get('#explorerCommit')
									.should(($element) => {
										expect($element.text().trim()).to.equal('Explorer: ' + data.explorerCommit.trim());
									})

							})
					})
			})

	})

})
