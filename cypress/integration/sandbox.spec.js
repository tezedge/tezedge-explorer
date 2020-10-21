/// <reference types="cypress" />

context('sandbox', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/')
  })

  // https://on.cypress.io/interacting-with-elements

  it('[sandbox] add node', () => {
    
    cy.server()
    cy.route({ method: 'POST', url: '/start', }).as('sandbox_server')
    cy.route({ method: 'POST', url: '/init_client', }).as('sandbox_wallet')
    cy.route({ method: 'POST', url: '/activate_protocol', }).as('sandbox_chain')
    cy.route({ method: 'GET', url: '/wallets', }).as('wallets')


    // start sandbox
    cy.get('.ng-star-inserted > div > .mat-focus-indicator').click()
    cy.location().should((location) => {
      expect(location.hash).to.eq('#/sandbox')
    });

    // config sandbox server
    cy.get('.footer-container > .mat-focus-indicator').click()
    cy.wait('@sandbox_server').then((xhr) => {
      expect(xhr.status).to.equal(200);
    });

    // select wallets and go to next step
    cy.get('.footer-container > .mat-focus-indicator').click()
    cy.wait('@sandbox_wallet').then((xhr) => {
      expect(xhr.status).to.equal(200);
    });

    // config sandbox chain
    cy.get('.footer-container > .mat-focus-indicator').click()
    cy.wait('@sandbox_chain').then((xhr) => {
      expect(xhr.status).to.equal(200);
    });

    cy.wait('@wallets').then((xhr) => {
      expect(xhr.status).to.equal(200);
    });


  })

})
