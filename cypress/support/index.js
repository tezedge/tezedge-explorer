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

import './commands';

export const testForTezedge = (test) => {
  if (localStorage.getItem('activeNode') === 'tezedge') {
    test();
  }
};

export const beforeEachForTezedge = (beforeEachBlock) => {
  cy.visit(Cypress.config().baseUrl)
    .wait(1000)
    .then(() => {
      if (localStorage.getItem('activeNode') === 'tezedge') {
        beforeEachBlock();
      }
    });
};

export const disableFeatures = (store, zone, featureNames) => {
  store.select('settingsNode').subscribe(settingsNode => {
    if (settingsNode.activeNode?.features.some(f => featureNames.includes(f.name))) {
      const activeNode = { ...settingsNode.activeNode };
      activeNode.features = activeNode.features.filter(f => !featureNames.includes(f.name));
      activeNode.connected = false;
      const payload = {
        activeNode,
        header: settingsNode.entities[settingsNode.ids[0]].header,
        features: activeNode.features
      };
      zone.run(() => store.dispatch({
        type: 'SETTINGS_NODE_CHANGE', payload: { activeNode: activeNode }
      }));
      zone.run(() => store.dispatch({
        type: 'SETTINGS_NODE_LOAD_SUCCESS', payload: payload
      }));
    }
  });
};
