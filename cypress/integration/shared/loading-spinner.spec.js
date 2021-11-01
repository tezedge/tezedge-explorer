context('LOADING SPINNER', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
  });

  it('[LOADING SPINNER] should render loading spinner component', () => {
    cy.get('app-loading-spinner').should('exist').then(popup => {
      expect(popup[0].childElementCount).to.equal(0);
    });
  });

  it('[LOADING SPINNER] should show that it\'s loading the resources', () => {
    cy.visit(Cypress.config().baseUrl + '/#/resources/system')
      .wait(500)
      .then(() => {
        cy.get('app-loading-spinner div.text-white-4').should('be.visible').then(div => {
          expect(div.text()).to.equal('Loading system resources...');
        });
        cy.get('app-loading-spinner div mat-spinner').should('be.visible');
      });
  });
  //
  // it('[LOADING SPINNER] should hide when resources are loaded', () => {
  //   cy.intercept('GET', '/resources/*').as('getSystemResources');
  //   cy.visit(Cypress.config().baseUrl + '/#/resources/system')
  //     .wait(500)
  //     .then(() => {
  //       cy.get('app-loading-spinner div.text-white-4').should('be.visible').then(div => {
  //         expect(div.text()).to.equal('Loading system resources...');
  //       });
  //       cy.get('app-loading-spinner div mat-spinner').should('be.visible');
  //       cy.wait('@getSystemResources', { timeout: 30000 }).then(() => {
  //         cy.get('app-loading-spinner div.text-white-4', { timeout: 30000 }).should('not.exist');
  //         cy.get('app-loading-spinner div mat-spinner', { timeout: 30000 }).should('not.exist');
  //       });
  //     });
  // });
  //
  // it('[LOADING SPINNER] should show that it\'s loading state machine', () => {
  //   cy.visit(Cypress.config().baseUrl + '/#/state')
  //     .wait(500)
  //     .then(() => {
  //       cy.get('app-loading-spinner div.text-white-4').should('be.visible').then(div => {
  //         expect(div.text().includes('Loading state machine')).to.be.true;
  //       });
  //       cy.get('app-loading-spinner div mat-spinner').should('be.visible');
  //     });
  // });
  //
  // it('[LOADING SPINNER] should show that it\'s loading the network', () => {
  //   cy.visit(Cypress.config().baseUrl + '/#/network')
  //     .then(() => {
  //       cy.get('app-loading-spinner div.text-white-4').should('be.visible').then(div => {
  //         expect(div.text()).to.equal('Loading network...');
  //       });
  //       cy.get('app-loading-spinner div mat-spinner').should('be.visible');
  //     });
  // });
  //
  // it('[LOADING SPINNER] should show that it\'s loading the logs', () => {
  //   cy.visit(Cypress.config().baseUrl + '/#/logs')
  //     .then(() => {
  //       cy.get('app-loading-spinner div.text-white-4').should('be.visible').then(div => {
  //         expect(div.text()).to.equal('Loading logs...');
  //       });
  //       cy.get('app-loading-spinner div mat-spinner').should('be.visible');
  //     });
  // });
  //
  // it('[LOADING SPINNER] should show that it\'s loading the storage blocks', () => {
  //   cy.visit(Cypress.config().baseUrl + '/#/storage')
  //     .then(() => {
  //       cy.get('app-loading-spinner div.text-white-4').should('be.visible').then(div => {
  //         expect(div.text()).to.equal('Loading storage blocks...');
  //       });
  //       cy.get('app-loading-spinner div mat-spinner').should('be.visible');
  //     });
  // });

});
