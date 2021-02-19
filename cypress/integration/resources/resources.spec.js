context('resources', () => {
    beforeEach(() => {
        cy.intercept('GET', '/resources/tezedge').as('getTezedgeResources');
        cy.visit(Cypress.config().baseUrl);
        cy.wait(1000);
        cy.visit(Cypress.config().baseUrl + '/#/resources', { timeout: 1000 });
        cy.wait(1000);
    })

    it('[resources] should perform get resources request successfully', () => {
        cy.wait('@getTezedgeResources').its('response.statusCode').should('eq', 200);
    })

    it('[resources] should parse tezedge RPC response successfully', () => {
        cy.wait('@getTezedgeResources')
            .then(() => {
                cy.window()
                    .its('store')
                    .then((store) => {
                        store.select('resources')
                            .subscribe((data) => {
                                const parsingBackendResponseSuccessfully = data.resources.every(r => {
                                    return typeof r.timestamp === 'string'
                                        && r.timestamp.length === 5
                                        && r.cpu.node !== undefined
                                        && r.disk.blockStorage !== undefined
                                        && r.disk.mainDb !== undefined
                                        && r.memory.node.resident !== undefined
                                        && r.memory.protocolRunners.resident !== undefined
                                        && r.memory.protocol_runners === undefined
                                        && r.disk.block_storage === undefined
                                });
                                cy.wrap(parsingBackendResponseSuccessfully).should('eq', true);
                            });
                    })
            })
    })

    it('[resources] should display charts', () => {
        cy.wait('@getTezedgeResources')
            .then(() => {
                cy.window()
                    .its('store')
                    .then((store) => {
                        store.select('resources')
                            .subscribe(() => {
                                cy.get('.resource-category-block')
                                    .its('length')
                                    .should(value => expect(value).to.equal(3))
                                cy.get('app-tezedge-line-chart')
                                    .its('length')
                                    .should(value => expect(value).to.equal(3))
                            });
                    })
            })
    })

    it('[resources] should display tooltip on chart when hovering on it', () => {
        cy.wait('@getTezedgeResources')
            .then(() => {
                cy.window()
                    .its('store')
                    .then((store) => {
                        store.select('resources')
                            .subscribe(() => {
                                cy.get('.tooltip-area')
                                    .its(2)
                                    .trigger('mousemove')
                                    .then(() => {
                                        cy.wait(1000);
                                        cy.get('.ngx-charts-tooltip-content').should(value => expect(value).to.not.equal(undefined));
                                    })
                            });
                    })
            })
    })
})
