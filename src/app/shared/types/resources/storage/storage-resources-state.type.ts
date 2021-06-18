import { StorageResourcesStats } from './storage-resources-stats.type';

export interface StorageResourcesState {
  storageResources: StorageResourcesStats;
  availableContexts: string[];
}
