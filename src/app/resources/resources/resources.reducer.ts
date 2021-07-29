import { SystemResourcesActions, SystemResourcesActionTypes } from '../system-resources/system-resources.actions';
import { SystemResources } from '../../shared/types/resources/system/system-resources.type';
import { StorageResourcesActions, StorageResourcesActionTypes } from '../storage-resources/storage-resources.actions';
import { MemoryResource } from '../../shared/types/resources/memory/memory-resource.type';
import { MemoryResourcesActions, MemoryResourcesActionTypes } from '../memory-resources/memory-resources.actions';
import { StorageResourcesState } from '../../shared/types/resources/storage/storage-resources-state.type';
import { State } from '../../app.reducers';
import { SystemResourcesPanel } from '../../shared/types/resources/system/system-resources-panel.type';
import { SystemResourceCategory } from '../../shared/types/resources/system/system-resource-category.type';

export interface ResourcesState {
  systemResources: SystemResources;
  storageResourcesState: StorageResourcesState;
  memoryResources: MemoryResource;
}

const initialState: ResourcesState = {
  systemResources: null,
  storageResourcesState: { storageResources: null, availableContexts: [] },
  memoryResources: null,
};

export function reducer(state: ResourcesState = initialState, action: SystemResourcesActions | StorageResourcesActions | MemoryResourcesActions): ResourcesState {
  switch (action.type) {
    case SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD_SUCCESS: {
      return {
        ...state,
        systemResources: { ...action.payload }
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
        runnerGroups
      } as SystemResourcesPanel;

      return {
        ...state,
        systemResources: {
          ...state.systemResources,
          resourcesSummary: panel
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
    case MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD_SUCCESS: {
      return {
        ...state,
        memoryResources: action.payload
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
    default:
      return state;
  }
}

export const systemResources = (state: State) => state.resources.systemResources;
export const systemResourcesDetails = (state: State) => state.resources.systemResources.resourcesSummary;
export const storageResources = (state: State) => state.resources.storageResourcesState;
export const memoryResources = (state: State) => state.resources.memoryResources;
