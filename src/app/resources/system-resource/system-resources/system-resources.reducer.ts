import {
  SYSTEM_RESOURCES_DETAILS_UPDATE,
  SYSTEM_RESOURCES_LOAD_SUCCESS,
  SYSTEM_RESOURCES_SORT,
  SystemResourcesActions
} from '@resources/system-resource/system-resources/system-resources.actions';
import { State } from '@app/app.index';
import { SystemResourcesPanel, SystemResourcesSortBy } from '@shared/types/resources/system/system-resources-panel.type';
import { SystemResourceCategory } from '@shared/types/resources/system/system-resource-category.type';
import { SystemResourcesSubcategoryRunnerGroup } from '@shared/types/resources/system/system-resources-subcategory-runner-group.type';
import { SystemResourcesState } from '@shared/types/resources/system/system-resources-state.type';

const initialState: SystemResourcesState = {
  cpu: { series: [], formattingType: '' },
  memory: { series: [], formattingType: '' },
  storage: { series: [], formattingType: '' },
  io: { series: [], formattingType: '' },
  network: { series: [], formattingType: '' },
  xTicksValues: null,
  resourcesPanel: null,
  colorScheme: { domain: [] },
};

export function reducer(state: SystemResourcesState = initialState, action: SystemResourcesActions): SystemResourcesState {
  switch (action.type) {

    case SYSTEM_RESOURCES_LOAD_SUCCESS: {
      return {
        ...action.payload,
        resourcesPanel: state.resourcesPanel?.type === 'runnerGroups' ? state.resourcesPanel : action.payload.resourcesPanel
      };
    }

    case SYSTEM_RESOURCES_DETAILS_UPDATE: {
      const resourceCategory = state[action.payload.resourceType] as SystemResourceCategory;
      const blocks = resourceCategory?.labels.map((label, index) => ({
        name: label,
        value: resourceCategory.series[index].series.find(s => s.name === action.payload.timestamp).value,
        formattingType: resourceCategory.formattingType
      }));
      const runnerGroups = resourceCategory?.series.map(s => s.series.find(se => se.name === action.payload.timestamp).runnerGroups)
        .filter(Boolean)
        .reduce((acc, current) => [...acc, ...current], []);

      const panel = {
        type: action.payload.type,
        resourceType: action.payload.resourceType,
        timestamp: action.payload.timestamp,
        blocks,
        runnerGroups: sort(runnerGroups, state.resourcesPanel.sortBy)
      } as SystemResourcesPanel;

      return {
        ...state,
        resourcesPanel: panel
      };
    }

    case SYSTEM_RESOURCES_SORT: {
      const runnerGroups = sort(state.resourcesPanel.runnerGroups, action.payload.sortBy);
      return {
        ...state,
        resourcesPanel: {
          ...state.resourcesPanel,
          runnerGroups,
          sortBy: action.payload.sortBy
        }
      };
    }

    default:
      return state;
  }
}

function sort(unsortedGroups: SystemResourcesSubcategoryRunnerGroup[], sortBy: SystemResourcesSortBy): SystemResourcesSubcategoryRunnerGroup[] {
  const runnerGroups = [...unsortedGroups.map(group => ({ ...group }))];
  if (sortBy === 'size') {
    runnerGroups.sort((r1, r2) => r2.total - r1.total);
    runnerGroups.forEach(group => {
      group.values = [...group.values].sort((v1, v2) => v2.total - v1.total);
    });
  } else {
    runnerGroups.sort((r1, r2) => r2.property < r1.property && 1 || -1);
    runnerGroups.forEach(group => {
      group.values = [...group.values].sort((v1, v2) => v2.name < v1.name && 1 || -1);
    });
  }

  return runnerGroups;
}

export const systemResources = (state: State) => state.resources.systemResources;
export const systemResourcesPanel = (state: State) => state.resources.systemResources.resourcesPanel;
