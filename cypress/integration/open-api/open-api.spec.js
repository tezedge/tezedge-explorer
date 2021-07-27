context('OPEN API', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
    cy.visit(Cypress.config().baseUrl + '/#/open-api', { timeout: 2000 });
    cy.wait(1000);
  });

  it('[OPEN API] should navigate successfully to open-api page', () => {
    cy.wait(1000).then(() => {
      cy.url().should('include', '/#/open-api');
    });
  });

  it('[OPEN API] should display tabs according to the enabled features', () => {
    cy.wait(1000).then(() => {
      cy.window().its('store').then((store) => {
        store.select('settingsNode').subscribe((node) => {
          let tabCount = 1;
          const showMemoryFeature = node.activeNode.features.find(f => f.name === 'resources/memory');
          const showNetworkRecorderFeature = node.activeNode.features.find(f => f.name === 'debugger');
          if (showMemoryFeature) {
            tabCount++;
          }
          if (showNetworkRecorderFeature) {
            tabCount++;
          }
          cy.get(`app-open-api`).should('be.visible');
          cy.get(`app-open-api .tabs .tab`).should('have.length', tabCount);
        })
      })
    });
  });

  it('[OPEN API] should render HTML successfully', () => {
    cy.wait(1000).then(() => {
      cy.get('#node-open-api').should('be.visible');
      cy.get('.swagger-ui').should('be.visible');
      cy.get('.block.block-desktop').should('be.visible');
      cy.get('section.models').should('be.visible');
    });
  });

  it('[OPEN API] should render RPC list on row click', () => {
    cy.wait(1000).then(() => {
      cy.get('.swagger-ui .wrapper:nth-child(4) section div span:nth-child(1) .opblock-tag-section h3').click();
      cy.wait(500).then(() => {
        cy.get('.operation-tag-content').should('be.visible');
        cy.get('.opblock-summary').should('have.length.at.least', 1);
      })
    });
  });

  it('[OPEN API] should render RPC\'s details on click', () => {
    cy.wait(2000).then(() => {
      cy.get('.swagger-ui .wrapper:nth-child(4) section div span:nth-child(1) .opblock-tag-section h3').click();
      cy.wait(500).then(() => {
        cy.get('.operation-tag-content span:nth-child(1) .opblock-summary').should('be.visible');
        cy.get('.operation-tag-content span:nth-child(1) .opblock-summary').click();
        cy.wait(500).then(() => {
          cy.get('.operation-tag-content span:nth-child(1) .opblock-section').should('be.visible');
          cy.get('.operation-tag-content span:nth-child(1) .opblock-section .tab-header').should('be.visible');
          cy.get('.operation-tag-content span:nth-child(1) .opblock-section .btn.try-out__btn').should('be.visible');
          cy.get('.operation-tag-content span:nth-child(1) .opblock-section .opblock-title.parameter__name').should('be.visible');
          cy.get('.operation-tag-content span:nth-child(1) .opblock-section .body-param__example').should('be.visible');
          cy.get('.operation-tag-content span:nth-child(1) .responses-wrapper .response-col_status').should('be.visible');
        });
      });
    });
  });

});
