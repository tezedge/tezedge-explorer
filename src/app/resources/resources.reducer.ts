import { SystemResources } from '@shared/types/resources/system/system-resources.type';
import { StorageResourcesState } from '@shared/types/resources/storage/storage-resources-state.type';
import { MemoryResource } from '@shared/types/resources/memory/memory-resource.type';
import { combineReducers } from '@ngrx/store';
import * as fromSystemResources from '@resources/system-resources/system-resources.reducer';
import * as fromStorageResources from '@resources/storage-resources/storage-resources.reducer';
import * as fromMemoryResources from '@resources/memory-resources/memory-resources.reducer';

export interface ResourcesState {
  systemResources: SystemResources;
  storageResourcesState: StorageResourcesState;
  memoryResources: MemoryResource;
}

export const reducer = combineReducers<ResourcesState>({
  systemResources: fromSystemResources.reducer,
  storageResourcesState: fromStorageResources.reducer,
  memoryResources: fromMemoryResources.reducer,
});
