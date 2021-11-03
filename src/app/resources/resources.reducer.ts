import { SystemResourcesState } from '@shared/types/resources/system/system-resources-state.type';
import { StorageResourcesState } from '@shared/types/resources/storage/storage-resources-state.type';
import { MemoryResourcesState } from '@shared/types/resources/memory/memory-resources-state.type';
import { StateResourcesState } from '@resources/state-resources/state-resources/state-resources.index';
import { combineReducers } from '@ngrx/store';
import * as fromSystemResources from '@resources/system-resource/system-resources/system-resources.reducer';
import * as fromStorageResources from '@resources/storage-resource/storage-resources/storage-resources.reducer';
import * as fromMemoryResources from '@resources/memory-resources/memory-resources.reducer';
import * as fromStateResources from '@resources/state-resources/state-resources/state-resources.reducer';

export interface ResourcesState {
  systemResources: SystemResourcesState;
  storageResourcesState: StorageResourcesState;
  memoryResourcesState: MemoryResourcesState;
  stateResourcesState: StateResourcesState;
}

export const reducer = combineReducers<ResourcesState>({
  systemResources: fromSystemResources.reducer,
  storageResourcesState: fromStorageResources.reducer,
  memoryResourcesState: fromMemoryResources.reducer,
  stateResourcesState: fromStateResources.reducer,
});
