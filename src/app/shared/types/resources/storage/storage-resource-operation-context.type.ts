import { ResourceStorageQuery } from './resource-storage-operation.type';

export class StorageResourceOperationContext {
  root: string;
  actionsCount: number;
  totalTime: number;
  totalTimeRead: number;
  totalTimeWrite: number;
  mem: ResourceStorageQuery;
  find: ResourceStorageQuery;
  findTree: ResourceStorageQuery;
  add: ResourceStorageQuery;
  addTree: ResourceStorageQuery;
  remove: ResourceStorageQuery;
}
