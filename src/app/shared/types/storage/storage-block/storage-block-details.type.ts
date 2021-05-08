import { StorageBlockDetailsOperationContext } from './storage-block-details-operation-context.type';

export class StorageBlockDetails {
  actionsCount: number;
  checkoutContextTime: number;
  commitContextTime: number;
  operationsContext: StorageBlockDetailsOperationContext[];
}
