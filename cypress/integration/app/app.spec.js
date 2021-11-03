context('APP', () => {
  beforeEach(() => {
    cy.intercept('GET', '/chains/main/blocks/head/header').as('getNodeHeader')
      .visit(Cypress.config().baseUrl)
      .wait('@getNodeHeader')
      .wait(1000);
  });

  it('[APP] should have status code 200 for get node header request', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          cy.request(settingsNode.activeNode.http + '/chains/main/blocks/head/header')
            .its('status')
            .should('eq', 200);
        });
      });
  });

  it('[APP] should display available features in app menu', () => {
    cy.window()
      .its('store')
      .then((store) => {
        store.select('settingsNode').subscribe(nodeSettings => {
          const possibleMenus = ['monitoring', 'mempool', 'resources', 'network', 'logs'];
          if (nodeSettings.activeNode.type !== 'octez') {
            possibleMenus.push('storage');
            possibleMenus.push('state');
          }
          possibleMenus.forEach(menu => {
            if (nodeSettings.activeNode.features.some(f => f.name.includes(menu))) {
              cy.get(`#${menu}-trigger`).should('be.visible');
            }
          });
        });
      });
  });

  it('[APP] should have fuzzing option rendered successfully', () => {
    cy.get('app-navigation-menu .app-submenu a')
      .then(elements => {
        const fuzzing = Array.from(elements).find(elem => elem.textContent.includes('Fuzzing'));
        expect(fuzzing).to.have.attr('href', 'http://fuzz.tezedge.com');
        expect(fuzzing).to.have.attr('target', '_blank');
      });
  });

  it('[APP] should have documentation option rendered successfully', () => {
    cy.get('app-navigation-menu .app-submenu a')
      .then(elements => {
        const documentationElement = Array.from(elements).find(elem => elem.textContent.includes('Documentation'));
        expect(documentationElement).to.have.attr('href', 'https://docs.tezedge.com');
        expect(documentationElement).to.have.attr('target', '_blank');
      });
  });

  it('[APP] should have open api option rendered successfully', () => {
    cy.get('app-navigation-menu .app-submenu a')
      .then(elements => {
        const openApiElement = Array.from(elements).find(elem => elem.textContent.includes('Open API'));
        expect(openApiElement).to.have.attr('routerLink', '/open-api');
        expect(openApiElement).to.have.attr('routerLinkActive', 'active');
      });
  });

});
