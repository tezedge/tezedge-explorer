import { ResourceStorageOperation } from './resource-storage-operation.type';

export class StorageResourceOperationContext {
  root: string;
  mem: ResourceStorageOperation;
  find: ResourceStorageOperation;
  findTree: ResourceStorageOperation;
  add: ResourceStorageOperation;
  addTree: ResourceStorageOperation;
  remove: ResourceStorageOperation;
}
