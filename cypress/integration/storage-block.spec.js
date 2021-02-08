context('storage-block', () => {
	beforeEach(() => {
		cy.intercept('GET', '/dev/chains/main/blocks/*').as('getStorageBlockRequest');
		cy.visit(Cypress.config().baseUrl);
		cy.wait(1000);
		cy.visit(Cypress.config().baseUrl + '/#/storage', {timeout: 10000});
		cy.wait(1000);
	})

	it('[storage-block] perform storage-block request successfully', () => {
		cy.wait('@getStorageBlockRequest').its('response.statusCode').should('eq', 200);
	})

	it('[storage-block] create rows for the virtual scroll table', () => {
		cy.wait('@getStorageBlockRequest')
			.then(() => {
				cy.wait(2000);
				cy.get('.virtual-scroll-container')
					.find('.virtualScrollRow');
			})

	})

	it('[storage-block] fill the last row of the table with the last value received', () => {
		cy.wait('@getStorageBlockRequest')
			.then(() => {
				cy.get('#stopStreaming').click();
				cy.wait(2000);

				cy.window()
					.its('store')
					.then((store) => {
						store.select('storageBlock')
							.subscribe((data) => {
								if (!data.stream) {
									const lastRecord = data.entities[data.ids[data.ids.length - 1]];

									cy.get('.virtual-scroll-container .virtualScrollRow.used')
										.last()
										.find('.storage-block-level')
										.should(($span) => {
											expect($span.text().trim()).to.equal(lastRecord.id);
										})
								} else {
									cy.get('#stopStreaming').click();
								}
							})

					})
			})

	})
	/*
		it('[logs] initially select the last record and fill the right details part with its message', () => {
			cy.wait(1000)
				.then(() => {
					cy.get('#stopStreaming').click();

					cy.window()
						.its('store')
						.then((store) => {
							store.select('logsAction')
								.subscribe((data) => {
									if (!data.stream) {
										const lastRecord = data.entities[data.ids[data.ids.length - 1]];

										cy.get('#virtualScrollTableDetails .ngx-json-viewer')
											.contains(lastRecord.message);
									} else {
										cy.get('#stopStreaming').click();
									}
								})

						})
				})

		})

		it('[logs] fill the right details part with the message of the hovered row - the second last record in our case', () => {
			cy.wait(1000)
				.then(() => {
					cy.get('#stopStreaming').click();

					cy.window()
						.its('store')
						.then((store) => {
							store.select('logsAction')
								.subscribe((data) => {
									if (!data.stream) {
										const secondLastRecord = data.entities[data.ids[data.ids.length - 2]];

										cy.get('.virtual-scroll-container .virtualScrollRow.used')
											.eq(-2)
											.trigger('mouseenter');

										cy.get('#virtualScrollTableDetails .ngx-json-viewer')
											.contains(secondLastRecord.message);
									} else {
										cy.get('#stopStreaming').click();
									}
								})

						})
				})

		})
*/
	it('[storage-block] change the value of the virtual scroll element when scrolling', () => {
		let beforeScrollValue;

		cy.wait(1000)
			.then(() => {
				cy.get('#stopStreaming').click();

				cy.window()
					.its('store')
					.then((store) => {
						store.select('storageBlock')
							.subscribe((data) => {
								if (!data.stream) {
									cy.get('.virtual-scroll-container .virtualScrollRow.used')
										.last()
										.find('.storage-block-level')
										.then(($span) => {
											beforeScrollValue = $span.text();
										});

									cy.wait(2000);

									// cy.get('.virtual-scroll-container').scrollTo('top');
									cy.get('.virtual-scroll-container .virtualScrollRow.used')
										.first()
										.scrollIntoView({duration: 500});

									cy.wait(2000);

									cy.get('.virtual-scroll-container .virtualScrollRow.used')
										.last()
										.find('.storage-block-level')
										.should(($span) => {
											expect($span.text()).to.not.equal(beforeScrollValue);
										});
								} else {
									cy.get('#stopStreaming').click();
								}
							})

					})

			})

	})
})
