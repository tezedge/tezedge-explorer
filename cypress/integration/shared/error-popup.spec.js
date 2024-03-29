context('ERROR POPUP', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl)
      .wait(2500);
  });

  it('[ERROR POPUP] should render error popup component', () => {
    cy.get('app-error-popup').should('exist').then(popup => {
      expect(popup).not.to.be.undefined;
      expect(popup.find('notifier-container.notifier__container')).not.to.be.undefined;
      expect(popup.find('notifier-container.notifier__container')).not.to.be.undefined;
      expect(popup.find('notifier-container.notifier__container ul')).not.to.be.undefined;
    });
  });

  it('[ERROR POPUP] should show error popup when dispatching action to add error in the store', () => {
    cy.window().its('zone').then((zone) => {
      cy.window().its('store').then((store) => {
        const title = 'mock error title';
        const message = 'mock error message';
        zone.run(() => store.dispatch({ type: 'ADD_ERROR', payload: { title, message } }));
        cy.wait(1000)
          .get('notifier-notification.notifier__notification').should('be.visible')
          .get('div.custom-notification').should('be.visible');
      });
    });
  });

  it('[ERROR POPUP] should show maximum 4 error popups even if there are more errors', () => {
    cy.window().its('zone').then((zone) => {
      cy.window().its('store').then((store) => {
        const title = 'mock error title';
        const message = 'mock error message';
        for (let i = 0; i < 10; i++) {
          zone.run(() => store.dispatch({ type: 'ADD_ERROR', payload: { title: title + i, message: message + i } }));
        }
        cy.wait(1000)
          .get('notifier-notification.notifier__notification').should('have.length.at.most', 5)
          .get('div.custom-notification').should('be.visible');
      });
    });
  });

  it('[ERROR POPUP] should show only unique errors and ignoring duplicates spamming', () => {
    cy.window().its('zone').then((zone) => {
      cy.window().its('store').then((store) => {
        zone.run(() => store.dispatch({ type: 'REMOVE_ERRORS' }));
        cy.wait(2000).then(() => {
          const title = 'mock error title';
          const message = 'mock error message';
          for (let i = 0; i < 10; i++) {
            zone.run(() => store.dispatch({ type: 'ADD_ERROR', payload: { title, message } }));
          }
          cy.wait(1000)
            .get('div.custom-notification .title').should((titleDivArray) => {
            const length = Array.from(titleDivArray).filter(div => div.textContent === title).length;
            expect(length).to.equal(1);
          });
        });
      });
    });
  });

  it('[ERROR POPUP] should remove errors', () => {
    cy.window().its('zone').then((zone) => {
      let oneStrike = false;
      cy.window().its('store').then((store) => {
        cy.wait(100)
          .then(() => {
            zone.run(() => store.dispatch({ type: 'REMOVE_ERRORS' }));
          })
          .wait(100)
          .then(() => {
            store.select('error').subscribe(errorState => {
              if (!oneStrike) {
                oneStrike = true;
                expect(errorState.errors.length).to.equal(0);
              }
            });
          });
      });
    });
  });

});
