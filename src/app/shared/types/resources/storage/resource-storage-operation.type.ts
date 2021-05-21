import { ResourceStorageQueryDetails } from './resource-storage-operation-usage-entry.type';

export class ResourceStorageQuery {
  totalTime: number;
  actionsCount: number;
  oneToTenUs: ResourceStorageQueryDetails;
  tenToOneHundredUs: ResourceStorageQueryDetails;
  oneHundredUsToOneMs: ResourceStorageQueryDetails;
  oneToTenMs: ResourceStorageQueryDetails;
  tenToOneHundredMs: ResourceStorageQueryDetails;
  oneHundredMsToOneS: ResourceStorageQueryDetails;
  oneToTenS: ResourceStorageQueryDetails;
  tenToOneHundredS: ResourceStorageQueryDetails;
  oneHundredS: ResourceStorageQueryDetails;
}
