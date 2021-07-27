import { SystemResourcesActions, SystemResourcesActionTypes } from '../system-resources/system-resources.actions';
import { SystemResources } from '../../shared/types/resources/system/system-resources.type';
import { StorageResourcesActions, StorageResourcesActionTypes } from '../storage-resources/storage-resources.actions';
import { MemoryResource } from '../../shared/types/resources/memory/memory-resource.type';
import { MemoryResourcesActions, MemoryResourcesActionTypes } from '../memory-resources/memory-resources.actions';
import { StorageResourcesState } from '../../shared/types/resources/storage/storage-resources-state.type';
import { State } from '../../app.reducers';
import { SystemResourcesPanel, SystemResourcesSortBy } from '../../shared/types/resources/system/system-resources-panel.type';
import { SystemResourceCategory } from '../../shared/types/resources/system/system-resource-category.type';
import { SystemResourcesSubcategoryRunnerGroup } from '../../shared/types/resources/system/system-resources-subcategory-runner-group.type';

export interface ResourcesState {
  systemResources: SystemResources;
  storageResourcesState: StorageResourcesState;
  memoryResources: MemoryResource;
}

const initialState: ResourcesState = {
  systemResources: {
    cpu: null,
    memory: null,
    storage: null,
    io: null,
    network: null,
    xTicksValues: null,
    resourcesPanel: null,
    colorScheme: null,
  },
  storageResourcesState: {
    storageResources: null,
    availableContexts: []
  },
  memoryResources: null,
};

export function reducer(state: ResourcesState = initialState, action: SystemResourcesActions | StorageResourcesActions | MemoryResourcesActions): ResourcesState {
  switch (action.type) {
    case SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD: {
      return {
        ...state
      };
    }
    case SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD_SUCCESS: {
      return {
        ...state,
        systemResources: {
          ...action.payload,
          resourcesPanel: {
            ...action.payload.resourcesPanel,
            runnerGroups: sort(
              action.payload.resourcesPanel.runnerGroups,
              state.systemResources.resourcesPanel?.sortBy ?? action.payload.resourcesPanel.sortBy
            )
          }
        }
      };
    }
    case SystemResourcesActionTypes.SYSTEM_RESOURCES_DETAILS_UPDATE: {
      const resourceCategory = state.systemResources[action.payload.resourceType] as SystemResourceCategory;
      const blocks = resourceCategory.labels.map((label, index) => ({
        name: label,
        value: resourceCategory.series[index].series.find(s => s.name === action.payload.timestamp).value,
        formattingType: resourceCategory.formattingType
      }));
      const runnerGroups = resourceCategory.series.map(s => s.series.find(se => se.name === action.payload.timestamp).runnerGroups)
        .filter(Boolean)
        .reduce((acc, current) => [...acc, ...current], []);

      const panel = {
        type: action.payload.type,
        resourceType: action.payload.resourceType,
        timestamp: action.payload.timestamp,
        blocks,
        runnerGroups: sort(runnerGroups, state.systemResources.resourcesPanel.sortBy)
      } as SystemResourcesPanel;

      return {
        ...state,
        systemResources: {
          ...state.systemResources,
          resourcesPanel: panel
        }
      };
    }
    case SystemResourcesActionTypes.SYSTEM_RESOURCES_SORT: {
      const runnerGroups = sort(state.systemResources.resourcesPanel.runnerGroups, action.payload.sortBy);
      return {
        ...state,
        systemResources: {
          ...state.systemResources,
          resourcesPanel: {
            ...state.systemResources.resourcesPanel,
            runnerGroups,
            sortBy: action.payload.sortBy
          }
        }
      };
    }
    case StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD_SUCCESS: {
      return {
        ...state,
        storageResourcesState: {
          availableContexts: state.storageResourcesState.availableContexts,
          storageResources: action.payload
        }
      };
    }
    case StorageResourcesActionTypes.STORAGE_RESOURCES_MAP_AVAILABLE_CONTEXTS: {
      return {
        ...state,
        storageResourcesState: {
          ...state.storageResourcesState,
          availableContexts: action.payload,
        }
      };
    }
    case MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD_SUCCESS: {
      return {
        ...state,
        memoryResources: action.payload
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
export const storageResources = (state: State) => state.resources.storageResourcesState;
export const memoryResources = (state: State) => state.resources.memoryResources;
