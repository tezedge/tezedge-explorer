context('PROGRESS BAR', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
    cy.wait(1000);
    cy.visit(Cypress.config().baseUrl + '/#/resources/system', { timeout: 2000 });
    cy.wait(1000);
  });

  it('[PROGRESS BAR] should render progress bar successfully', () => {
    cy.wait(1000).then(() => {
      cy.get('body').find('.mat-progress-bar').then(bar => {
        expect(bar).not.to.be.undefined;
      });
    });
  });

  it('[PROGRESS BAR] should be hidden', () => {
    cy.wait(2000).then(() => {
      cy.get('body').find('.mat-progress-bar').then(bar => {
        expect(bar).css('visibility', 'hidden');
      });
    });
  });

});
