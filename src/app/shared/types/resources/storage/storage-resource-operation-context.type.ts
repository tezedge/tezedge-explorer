import { ResourceStorageQuery } from './resource-storage-operation.type';

export class StorageResourceOperationContext {
  root: string;
  totalTime: number;
  count: number;
  mem: ResourceStorageQuery;
  find: ResourceStorageQuery;
  findTree: ResourceStorageQuery;
  add: ResourceStorageQuery;
  addTree: ResourceStorageQuery;
  remove: ResourceStorageQuery;
}
