import { testForTezedge } from '../../support';

const beforeSmartContractTest = (test) => {
  let tested = false;
  cy.visit(Cypress.config().baseUrl + '/#/contracts', { timeout: 100000 })
    .window()
    .its('store')
    .then({ timeout: 5100 }, store => {
      return new Cypress.Promise((resolve) => {
        setTimeout(() => resolve(), 5000);
        store.select('smartContracts').subscribe(smartContracts => {
          if (!tested && smartContracts.contracts.length > 0) {
            tested = true;
            testForTezedge(test);
            resolve();
          }
        });
      });
    });
};

context('SMART CONTRACTS', () => {

  it('[SMART CONTRACTS] should have status code 200 for get block details', () => beforeSmartContractTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          cy.request(settingsNode.activeNode.http + '/chains/main/blocks/head')
            .its('status')
            .should('eq', 200);
        });
      });
  }));

  it('[SMART CONTRACTS] should create rows for the cdk virtual scroll table', () => beforeSmartContractTest(() => {
    cy.get('app-smart-contracts app-smart-contracts-table .row.head').should('be.visible')
      .window()
      .its('store')
      .then(store => {
        store.select('smartContracts').subscribe(smartContracts => {
          if (smartContracts.contracts.length > 0) {
            cy.get('app-smart-contracts app-smart-contracts-table cdk-virtual-scroll-viewport .row', { timeout: 400000 }).should('be.visible');
          }
        });
      });
  }));

  it('[SMART CONTRACTS] should select smart contract on click', () => beforeSmartContractTest(() => {
    let clicked;
    cy.window()
      .its('store')
      .then(store => {
        store.select('smartContracts').subscribe(smartContracts => {
          if (smartContracts.contracts.length > 0) {
            cy.get('app-smart-contracts app-smart-contracts-table cdk-virtual-scroll-viewport .row', { timeout: 10000 })
              .eq(1)
              .click()
              .then(() => clicked = true);
          }
          if (clicked && smartContracts.activeContract) {
            clicked = false;
            expect(smartContracts.activeContract.hash).to.eq(smartContracts.contracts[1].hash);
            expect(smartContracts.activeContract.entrypoint).to.eq(smartContracts.contracts[1].entrypoint);
            expect(smartContracts.activeContract.totalConsumedGas).to.eq(smartContracts.contracts[1].totalConsumedGas);
          }
        });
      });
  }));

  // it('[SMART CONTRACTS] should show the code of the smart contract on click', () => beforeSmartContractTest(() => {
  //   let clicked;
  //   cy.window()
  //     .its('store')
  //     .then(store => {
  //       store.select('smartContracts').subscribe(smartContracts => {
  //         if (smartContracts.contracts.length > 0 && !clicked && smartContracts.contracts.every(c => c.totalConsumedGas)) {
  //           const sorted = [...smartContracts.contracts].sort((c1, c2) => c1.totalConsumedGas - c2.totalConsumedGas);
  //           const smallestGasContract = sorted[0];
  //           cy.get('app-smart-contracts app-smart-contracts-table cdk-virtual-scroll-viewport .row', { timeout: 10000 })
  //             .eq(smallestGasContract.id)
  //             .click()
  //             .then(() => clicked = true)
  //             .get('app-smart-contracts app-smart-contracts-code .monaco-editor .view-lines .view-line', { timeout: 200000 })
  //             .should('have.length.above', 5);
  //         }
  //       });
  //     });
  // }));

  it('[SMART CONTRACTS] should render 3 tabs', () => beforeSmartContractTest(() => {
    cy.get('app-smart-contracts div .overflow-hidden.flex-column .tabs .tab', { timeout: 10000 })
      .should('have.length', 3);
  }));

  it('[SMART CONTRACTS] should preselect debug tab', () => beforeSmartContractTest(() => {
    cy.get('app-smart-contracts div .overflow-hidden.flex-column .tabs .tab:first-child')
      .should('have.class', 'selected');
  }));

  it('[SMART CONTRACTS] should change to result tab', () => beforeSmartContractTest(() => {
    cy.get('app-smart-contracts div .overflow-hidden.flex-column .tabs .tab:nth-child(1)')
      .should('have.class', 'selected')
      .get('app-smart-contracts div .overflow-hidden.flex-column .tabs .tab:nth-child(2)')
      .click()
      .get('app-smart-contracts div .overflow-hidden.flex-column .tabs .tab:nth-child(2)')
      .should('have.class', 'selected')
      .get('app-smart-contracts div .overflow-hidden.flex-column .tabs .tab:nth-child(1)')
      .should('not.have.class', 'selected');
  }));

  it('[SMART CONTRACTS] should change to inputs tab', () => beforeSmartContractTest(() => {
    cy.get('app-smart-contracts div .overflow-hidden.flex-column .tabs .tab:nth-child(1)')
      .should('have.class', 'selected')
      .get('app-smart-contracts div .overflow-hidden.flex-column .tabs .tab:nth-child(3)')
      .click()
      .get('app-smart-contracts div .overflow-hidden.flex-column .tabs .tab:nth-child(3)')
      .should('have.class', 'selected')
      .get('app-smart-contracts div .overflow-hidden.flex-column .tabs .tab:nth-child(1)')
      .should('not.have.class', 'selected');
  }));

  it('[SMART CONTRACTS] should have next block button disabled', () => beforeSmartContractTest(() => {
    cy.get('app-smart-contracts app-smart-contracts-filters form > button:nth-child(2)')
      .should('be.disabled');
  }));

  it('[SMART CONTRACTS] should enable next block button when clicking on previous block button', () => beforeSmartContractTest(() => {
    cy.get('app-smart-contracts app-smart-contracts-filters form > button:nth-child(1)')
      .click()
      .wait(3000)
      .get('app-smart-contracts app-smart-contracts-filters form > button:nth-child(2)')
      .should('not.be.disabled');
  }));

  it('[SMART CONTRACTS] should select previous block when clicking on previous block button', () => beforeSmartContractTest(() => {
    let clicked;
    let asserted = false;
    let expectedPrevBlock = undefined;
    cy.window()
      .its('store')
      .then(store => {
        store.select('smartContracts').subscribe(smartContracts => {
          if (smartContracts.contracts.length > 0 && !clicked && !expectedPrevBlock) {
            expectedPrevBlock = smartContracts.blockHashContext.hashes[smartContracts.blockHashContext.activeIndex - 1];
            if (expectedPrevBlock !== undefined) {
              cy.get('app-smart-contracts app-smart-contracts-filters form > button:nth-child(1)', { timeout: 2000 })
                .click()
                .then(() => {
                  clicked = true;
                  if (!asserted) {
                    cy.wait(1000)
                      .window()
                      .its('store')
                      .then(store => {
                        store.select('smartContracts').subscribe(smartContracts => {
                          if (!asserted) {
                            asserted = true;
                            const actualPrevBlock = smartContracts.blockHashContext.hashes[smartContracts.blockHashContext.activeIndex];
                            expect(expectedPrevBlock).to.equal(actualPrevBlock);
                          }
                        });
                      });
                  }
                });
            }
          }
        });
      });
  }));

  it('[SMART CONTRACTS] should change current block if clicking on recent block', () => beforeSmartContractTest(() => {
    let clicked;
    let asserted = false;
    let previousCurrentBlock;
    cy.get('app-smart-contracts app-smart-contracts-filters form > button:nth-child(1)')
      .click()
      .wait(3000)
      .window()
      .its('store')
      .then(store => {
        store.select('smartContracts').subscribe(smartContracts => {
          if (smartContracts.contracts.length > 0 && !clicked) {
            previousCurrentBlock = smartContracts.blockHashContext.hashes[smartContracts.blockHashContext.activeIndex];
            clicked = true;
            cy.get('app-smart-contracts app-smart-contracts-filters form > button:nth-child(3)')
              .should('not.be.disabled')
              .click();
          } else if (previousCurrentBlock && !asserted) {
            asserted = true;
            const newCurrentBlock = smartContracts.blockHashContext.hashes[smartContracts.blockHashContext.activeIndex];
            expect(previousCurrentBlock).to.not.equals(newCurrentBlock);
          }
        });
      });
  }));

  // it('[SMART CONTRACTS] should preselect a row on start', () => beforeSmartContractTest(() => {
  //   cy.window()
  //     .its('store')
  //     .then(store => {
  //       store.select('smartContracts').subscribe(smartContracts => {
  //         if (smartContracts.contracts.length > 0) {
  //           cy.get('app-smart-contracts app-smart-contracts-table cdk-virtual-scroll-viewport .row.active', { timeout: 200000 })
  //             .should('be.visible');
  //         }
  //       });
  //     });
  // }));

  it('[SMART CONTRACTS] should start debugging when pressing on start debug button', () => beforeSmartContractTest(() => {
    cy.window()
      .its('store')
      .then(store => {
        let currentContract = undefined;
        store.select('smartContracts').subscribe(smartContracts => {
          if (smartContracts.contracts.length > 0 && currentContract !== smartContracts.activeContract) {
            currentContract = smartContracts.activeContract;
            cy.get('app-smart-contracts app-smart-contracts-table cdk-virtual-scroll-viewport .row.active', { timeout: 40000 })
              .get('app-smart-contracts app-smart-contracts-code ngx-monaco-editor .view-lines .view-line:nth-child(4)', { timeout: 40000 })
              .get('app-smart-contracts app-smart-contracts-debug .debugger-inspect button:nth-child(1)', { timeout: 10000 })
              .wait(1000)
              .click()
              .then(() => {
                cy.window()
                  .its('store')
                  .then(store => {
                    store.select('smartContracts').subscribe(smartContracts => {
                      expect(smartContracts.isDebugging).to.be.true;
                      expect(smartContracts.debugConfig.currentStep).not.to.be.undefined;
                      expect(smartContracts.debugConfig.previousStep).to.be.undefined;
                    });
                  });
              });
          }
        });
      });
  }));

});
