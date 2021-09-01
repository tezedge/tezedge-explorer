import { StorageBlockDetailsOperationContext } from './storage-block-details-operation-context.type';

export class StorageBlockDetails {
  queriesCount: number;
  checkoutContextTime: number;
  commitContextTime: number;
  operationsContext: StorageBlockDetailsOperationContext[];
}
