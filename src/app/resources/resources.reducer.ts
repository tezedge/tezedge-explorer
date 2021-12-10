import { SystemResourcesState } from '@shared/types/resources/system/system-resources-state.type';
import { StorageResourcesState } from '@shared/types/resources/storage/storage-resources-state.type';
import { MemoryResourcesState } from '@shared/types/resources/memory/memory-resources-state.type';
import { combineReducers } from '@ngrx/store';
import * as fromSystemResources from '@resources/system-resources/system-resources.reducer';
import * as fromStorageResources from '@resources/storage-resources/storage-resources.reducer';
import * as fromMemoryResources from '@resources/memory-resources/memory-resources.reducer';

export interface ResourcesState {
  systemResources: SystemResourcesState;
  storageResourcesState: StorageResourcesState;
  memoryResourcesState: MemoryResourcesState;
}

export const reducer = combineReducers<ResourcesState>({
  systemResources: fromSystemResources.reducer,
  storageResourcesState: fromStorageResources.reducer,
  memoryResourcesState: fromMemoryResources.reducer,
});
