import { testForTezedge } from '../../support';

const isOctez = (data) => data.settingsNode.activeNode.type === 'octez';

describe('SYSTEM RESOURCES', () => {
  beforeEach(() => {
    cy.intercept('GET', '/resources/*').as('getResources')
      .visit(Cypress.config().baseUrl + '/#/resources/system', { timeout: 30000 })
      .wait('@getResources')
      .wait(1000);
  });

  it('[SYSTEM RESOURCES] should have status code 200 for system resources request', () => testForTezedge(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('settingsNode').subscribe(settingsNode => {
          cy.request(settingsNode.activeNode.features.find(f => f.name === 'resources/system').monitoringUrl)
            .its('status')
            .should('eq', 200);
        });
      });
  }));

  it('[SYSTEM RESOURCES] should parse tezedge RPC response successfully', () => testForTezedge(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(store => {
          const octez = store.settingsNode.activeNode.type === 'octez';
          if (!octez) {
            expect(store.resources.systemResources.colorScheme.domain).to.have.length(7);

            const cpu = store.resources.systemResources.cpu;
            const memory = store.resources.systemResources.memory;
            const storage = store.resources.systemResources.storage;
            const io = store.resources.systemResources.io;
            const network = store.resources.systemResources.network;
            const panel = store.resources.systemResources.resourcesPanel;
            expect(store.resources.systemResources.xTicksValues).to.have.length.above(0);
            expect(store.resources.systemResources.colorScheme.domain).to.have.length(7);

            expect(cpu.labels).to.have.length(3);
            expect(cpu.formattingType).to.equal('%');
            expect(cpu.series).to.have.length(3);
            cpu.series.forEach((s, i) => {
              expect(s.name.toLowerCase()).to.equal(cpu.labels[i].toLowerCase());
              if (s.series.length) {
                expect(s.series[0].name).to.not.be.undefined;
                expect(s.series[0].value).to.not.be.undefined;
              }
            });
            expect(cpu.series.find(s => s.name === 'NODE').series[0].runnerGroups).to.not.be.undefined;

            expect(memory.labels).to.have.length(3);
            expect(memory.formattingType).to.equal('MB');
            expect(memory.series).to.have.length(3);
            memory.series.forEach((s, i) => {
              expect(s.name.toLowerCase()).to.equal(memory.labels[i].toLowerCase());
              if (s.series.length) {
                expect(s.series[0].name).to.not.be.undefined;
                expect(s.series[0].value).to.not.be.undefined;
              }
            });
            expect(memory.series.find(s => s.name === 'VALIDATORS').series[0].runnerGroups).to.not.be.undefined;

            expect(storage.labels).to.have.length(7);
            expect(storage.formattingType).to.equal('GB');
            expect(storage.series).to.have.length(7);
            storage.series.forEach((s, i) => {
              expect(s.name.toLowerCase()).to.equal(storage.labels[i].toLowerCase());
              if (s.series.length) {
                expect(s.series[0].name).to.not.be.undefined;
                expect(s.series[0].value).to.not.be.undefined;
              }
            });

            expect(io.labels).to.have.length(6);
            expect(io.formattingType).to.equal('MB');
            expect(io.series).to.have.length(6);
            io.series.forEach((s, i) => {
              expect(s.name.toLowerCase()).to.equal(io.labels[i].toLowerCase());
              if (s.series.length) {
                expect(s.series[0].name).to.not.be.undefined;
                expect(s.series[0].value).to.not.be.undefined;
              }
            });
            expect(io.series.find(s => s.name === 'TOTAL READ').series[0].runnerGroups).to.not.be.undefined;

            expect(network.labels).to.have.length(2);
            expect(network.formattingType).to.equal('MB');
            expect(network.series).to.have.length(2);
            network.series.forEach((s, i) => {
              expect(s.name.toLowerCase()).to.equal(network.labels[i].toLowerCase());
              if (s.series.length) {
                expect(s.series[0].name).to.not.be.undefined;
                expect(s.series[0].value).to.not.be.undefined;
              }
            });

            Object.keys(panel).forEach(key => {
              expect(panel[key]).to.not.be.undefined;
            });
          }
        });
      });
  }));

  it('[SYSTEM RESOURCES] should sort threads by name', () => testForTezedge(() => {
    cy.get('.thread-container .sort-option:first-child', { timeout: 20000 })
      .trigger('click')
      .wait(1000)
      .window()
      .its('store')
      .then(store => {
        store.subscribe(store => {
          expect(store.resources.systemResources.resourcesPanel.sortBy).to.equal('name');
        });
      });
  }));

  it('[SYSTEM RESOURCES] should display charts', () => testForTezedge(() => {
    cy.window()
      .its('store')
      .then(store => {
        store.select('resources').subscribe(() => {
          cy.get('.resource-category-block')
            .its('length')
            .then(value => expect(value).to.equal(5))
            .get('app-tezedge-line-chart')
            .its('length')
            .then(value => expect(value).to.equal(5));
        });
      });
  }));

  it('[SYSTEM RESOURCES] should display tooltip on chart when hovering on it', () => testForTezedge(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(store => {
          if (store.resources.systemResources) {
            cy.get('svg g g g rect.tooltip-area', { timeout: 20000 })
              .its(2)
              .trigger('mousemove')
              .wait(1000)
              .get('.ngx-charts-tooltip-content').should(value => expect(value).to.not.be.undefined);
          }
        });
      });
  }));

  it('[SYSTEM RESOURCES] should display redirection overlay on chart when clicking on it and navigate to network on click', () => testForTezedge(() => {
    let routed;
    cy.window()
      .its('store')
      .then(store => {
        store.subscribe(store => {
          if (!routed && store.resources.systemResources) {
            routed = true;
            cy.get('svg g g g rect.tooltip-area')
              .its(2)
              .click(300, 20)
              .wait(1000)
              .get('app-graph-redirection-overlay .redirection-overlay').should('be.visible')
              .get('app-graph-redirection-overlay .redirection-overlay .pointer')
              .first().click()
              .wait(1000)
              .url().should('include', '/network?timestamp=');
          }
        });
      });
  }));

  it('[SYSTEM RESOURCES] should display redirection overlay on chart when clicking on it and navigate to logs on click', () => testForTezedge(() => {
    let routed;
    cy.window()
      .its('store')
      .then(store => {
        store.subscribe(store => {
          if (!routed && store.resources.systemResources) {
            routed = true;
            cy.get('svg g g g rect.tooltip-area')
              .its(2)
              .click(300, 20)
              .wait(1000)
              .get('app-graph-redirection-overlay .redirection-overlay').should('be.visible')
              .get('app-graph-redirection-overlay .redirection-overlay .pointer')
              .last().click()
              .wait(1000)
              .url().should('include', '/logs?timestamp=');
          }
        });
      });
  }));

});
