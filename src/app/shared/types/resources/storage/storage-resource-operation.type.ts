import { ResourceStorageQueryDetails } from './storage-resource-operation-usage-entry.type';

export interface ResourceStorageQuery {
  totalTime: number;
  queriesCount: number;
  columns: ResourceStorageQueryDetails[];
  totalTimeRead?: number;
  totalTimeWrite?: number;
}
