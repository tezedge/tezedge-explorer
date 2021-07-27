context('PROGRESS BAR', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
  });

  it('[PROGRESS BAR] should render progress bar successfully', () => {
    cy.wait(1000).then(() => {
      cy.get('body').find('.mat-progress-bar').then(bar => {
        expect(bar).not.to.be.undefined;
      });
    });
  });

  it('[PROGRESS BAR] should be hidden', () => {
    cy.wait(1000).then(() => {
      cy.get('body').find('.mat-progress-bar').then(bar => {
        expect(bar).css('visibility', 'hidden');
      });
    });
  });

});
