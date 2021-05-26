import { StorageResourceOperationContext } from './storage-resource-operation-context.type';
import { ResourceStorageQuery } from './storage-resource-operation.type';

export class StorageResourcesStats {
  checkoutContext: ResourceStorageQuery;
  commitContext: ResourceStorageQuery;
  operationsContext: Array<StorageResourceOperationContext>;
  totalContext: ResourceStorageQuery;
  contextSliceNames: string[];
}
