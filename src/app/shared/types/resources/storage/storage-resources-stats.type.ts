import { StorageResourceOperationContext } from './storage-resource-operation-context.type';
import { ResourceStorageQuery } from './resource-storage-operation.type';

export class StorageResourcesStats {
  checkoutContext: ResourceStorageQuery;
  commitContext: ResourceStorageQuery;
  operationsContext: Array<StorageResourceOperationContext>;
}
