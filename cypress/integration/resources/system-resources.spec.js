import { testForTezedge } from '../../support';

const beforeSystemResourcesTest = (test) => {
  let tested = false;
  cy.visit(Cypress.config().baseUrl + '/#/resources/system', { timeout: 100000 })
    .wait(1000)
    .window()
    .its('store')
    .then({ timeout: 15500 }, store => {
      return new Cypress.Promise((resolve) => {
        setTimeout(() => resolve(), 15000);
        store.subscribe(state => {
          if (!tested && state.resources.systemResources.xTicksValues) {
            tested = true;
            testForTezedge(test);
            resolve();
          }
        });
      });
    });
};

context('SYSTEM RESOURCES', () => {

  it('[SYSTEM RESOURCES] should have status code 200 for system resources request', () => beforeSystemResourcesTest(() => {
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

  it('[SYSTEM RESOURCES] should parse tezedge RPC response successfully', () => beforeSystemResourcesTest(() => {
    let tested = false;
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(state => {
          const octez = state.settingsNode.activeNode.type === 'octez';
          if (!tested && !octez && state.resources.systemResources.cpu) {
            tested = true;
            expect(state.resources.systemResources.colorScheme.domain).to.have.length(7);

            const cpu = state.resources.systemResources.cpu;
            const memory = state.resources.systemResources.memory;
            const storage = state.resources.systemResources.storage;
            const io = state.resources.systemResources.io;
            const network = state.resources.systemResources.network;
            const panel = state.resources.systemResources.resourcesPanel;
            expect(state.resources.systemResources.xTicksValues).to.have.length.above(0);
            expect(state.resources.systemResources.colorScheme.domain).to.have.length(7);

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
            expect(memory.formattingType).to.equal('GB');
            expect(memory.series).to.have.length(3);
            memory.series.forEach((s, i) => {
              expect(s.name.toLowerCase()).to.equal(memory.labels[i].toLowerCase());
              if (s.series.length) {
                expect(s.series[0].name).to.not.be.undefined;
                expect(s.series[0].value).to.not.be.undefined;
              }
            });
            expect(memory.series.find(s => s.name === 'VALIDATORS').series[0].runnerGroups).to.not.be.undefined;

            expect(storage.labels).to.have.length(6);
            expect(storage.formattingType).to.equal('GB');
            expect(storage.series).to.have.length(6);
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

  it('[SYSTEM RESOURCES] should sort threads by name', () => beforeSystemResourcesTest(() => {
    cy.get('.thread-container .sort-option:first-child', { timeout: 20000 })
      .trigger('click')
      .wait(1000)
      .window()
      .its('store')
      .then(store => {
        store.subscribe(state => {
          expect(state.resources.systemResources.resourcesPanel.sortBy).to.equal('name');
        });
      });
  }));

  it('[SYSTEM RESOURCES] should display charts', () => beforeSystemResourcesTest(() => {
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

  it('[SYSTEM RESOURCES] should display tooltip on chart when hovering on it', () => beforeSystemResourcesTest(() => {
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(state => {
          if (state.resources.systemResources.xTicksValues) {
            cy.get('svg g g g rect.tooltip-area', { timeout: 20000 })
              .its(2)
              .trigger('mousemove')
              .wait(1000)
              .get('.ngx-charts-tooltip-content').should(value => expect(value).to.not.be.undefined);
          }
        });
      });
  }));
});
