// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

export const testForTezedge = (test) => {
  cy.get('mat-select.hide-arrow', { withinSubject: null })
    .then(select => {
      // cy.log('id: ' + select.attr('id'));
      if (select.attr('id') === 'tezedge') {
        test();
      }
    });
};

export const beforeEachForTezedge = (beforeEachBlock) => {
  cy.visit(Cypress.config().baseUrl)
    .wait(1000)
    .get('mat-select.hide-arrow', { withinSubject: null })
    .then(select => {
      if (select && select.attr('id') === 'tezedge') {
        beforeEachBlock();
      }
    });
};

export const beforeEachForTezedge2 = (beforeEachBlock) => {
  // cy.intercept('GET', '/chains/main/blocks/head/header').as('findNode')
  //   .visit(Cypress.config().baseUrl)
  //   .wait('@findNode')
  //   .wait(2000)
  //   .window()
  //   .its('store')
  //   .then(store => {
  //     store.select('settingsNode').subscribe(settingsNode => {
  //       console.log(settingsNode.activeNode.id);
  //       if (settingsNode.activeNode.id === 'tezedge') {
  //         beforeEachBlock();
  //       }
  //     });
  //   });
  cy.visit(Cypress.config().baseUrl)
    .wait(1000)
    .get('mat-select.hide-arrow', { withinSubject: null })
    .then(select => {
      if (select.attr('id') === 'tezedge') {
        beforeEachBlock();
      }
    });
  // get('.settings-node-select mat-select.hide-arrow', { timeout: 10000 })
  //   .then(select => {
  //     if (select.attr('id') === 'tezedge') {
  //       testForTezedge(() => beforeEachBlock());
  //     }
  //   });
};
