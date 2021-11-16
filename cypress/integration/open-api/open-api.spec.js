context('OPEN API', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/#/open-api', { timeout: 2000 })
      .wait(1000);
  });

  it('[OPEN API] should navigate successfully to open-api page', () => {
    cy.url().should('include', '/#/open-api');
  });

  it('[OPEN API] should display tabs according to the enabled features', () => {
    cy.window().its('store').then(store => {
      store.select('settingsNode').subscribe(node => {
        let tabCount = 1;
        const showMemoryFeature = node.activeNode.features.find(f => f.name === 'resources/memory');
        const showNetworkRecorderFeature = node.activeNode.features.find(f => f.name === 'debugger');
        if (showMemoryFeature) {
          tabCount++;
        }
        if (showNetworkRecorderFeature) {
          tabCount++;
        }
        cy.get(`app-open-api`).should('be.visible')
          .get(`app-open-api .tabs .tab`).should('have.length', tabCount);
      });
    });
  });

  it('[OPEN API] should render HTML', () => {
    cy.get('#node-open-api').should('be.visible')
      .get('.swagger-ui').should('be.visible')
      .get('.block.block-desktop').should('be.visible')
      .get('section.models').should('be.visible');
  });

  it('[OPEN API] should render RPC list on row click', () => {
    cy.get('.swagger-ui .wrapper:nth-child(4) section div span:nth-child(1) .opblock-tag-section h3').click()
      .wait(1000)
      .get('.operation-tag-content').should('be.visible')
      .get('.opblock-summary').should('have.length.at.least', 1);
  });

  it('[OPEN API] should render RPC\'s details on click', () => {
    cy.get('.swagger-ui .wrapper:nth-child(4) section div span:nth-child(1) .opblock-tag-section h3').click()
      .wait(500)
      .get('.operation-tag-content span:nth-child(1) .opblock-summary').should('be.visible')
      .get('.operation-tag-content span:nth-child(1) .opblock-summary').click()
      .wait(500)
      .get('.operation-tag-content span:nth-child(1) .opblock-section').should('be.visible')
      .get('.operation-tag-content span:nth-child(1) .opblock-section .tab-header').should('be.visible')
      .get('.operation-tag-content span:nth-child(1) .opblock-section .btn.try-out__btn').should('be.visible')
      .get('.operation-tag-content span:nth-child(1) .opblock-section .opblock-title.parameter__name').should('be.visible')
      .get('.operation-tag-content span:nth-child(1) .opblock-section .body-param__example').should('be.visible')
      .get('.operation-tag-content span:nth-child(1) .responses-wrapper .response-col_status').should('be.visible');
  });
});
