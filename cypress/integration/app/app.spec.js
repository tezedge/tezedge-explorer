context('APP', () => {
  beforeEach(() => {
    cy.intercept('GET', '/chains/main/blocks/head/header').as('getNodeHeader');
    cy.visit(Cypress.config().baseUrl);
  });

  it('[APP] should perform get node header request successfully', () => {
    cy.wait(1000).then(() => {
      cy.wait('@getNodeHeader').its('response.statusCode').should('eq', 200);
    });
  });

  it('[APP] should display available features in app menu', () => {
    cy.wait(1000).then(() => {
      cy.wait('@getNodeHeader').then(() => {
        cy.window()
          .its('store')
          .then((store) => {
            store.select('settingsNode').subscribe(nodeSettings => {
              const possibleMenus = ['monitoring', 'mempool', 'resources', 'network', 'logs'];
              if (nodeSettings.activeNode.type !== 'octez') {
                possibleMenus.push('storage');
              }
              cy.wait(1000).then(() => {
                possibleMenus.forEach(menu => {
                  if (nodeSettings.activeNode.features.some(f => f.name.includes(menu))) {
                    cy.get(`#${menu}-trigger`).should('be.visible');
                  }
                });
              });
            });
          });
      });
    });
  });

  it('[APP] should have fuzzing option rendered successfully', () => {
    cy.wait(1000).then(() => {
      cy.get('app-navigation-menu .app-submenu a').should(elements => {
        const fuzzing = Array.from(elements).find(elem => elem.textContent.includes('Fuzzing'));
        expect(fuzzing).to.have.attr('href', 'http://fuzz.tezedge.com');
        expect(fuzzing).to.have.attr('target', '_blank');
      });
    });
  });

  it('[APP] should have documentation option rendered successfully', () => {
    cy.wait(1000).then(() => {
      cy.get('app-navigation-menu .app-submenu a').should(elements => {
        const documentationElement = Array.from(elements).find(elem => elem.textContent.includes('Documentation'));
        expect(documentationElement).to.have.attr('href', 'https://docs.tezedge.com');
        expect(documentationElement).to.have.attr('target', '_blank');
      });
    });
  });

  it('[APP] should have open api option rendered successfully', () => {
    cy.wait(1000).then(() => {
      cy.get('app-navigation-menu .app-submenu a').should(elements => {
        const openApiElement = Array.from(elements).find(elem => elem.textContent.includes('Open API'));
        expect(openApiElement).to.have.attr('routerLink', '/open-api');
        expect(openApiElement).to.have.attr('routerLinkActive', 'active');
      });
    });
  });

});
