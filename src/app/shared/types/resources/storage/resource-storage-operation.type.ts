import { ResourceStorageOperationUsageEntry } from './resource-storage-operation-usage-entry.type';

export class ResourceStorageOperation {
  oneToTenUs: ResourceStorageOperationUsageEntry;
  tenToOneHundredUs: ResourceStorageOperationUsageEntry;
  oneHundredUsToOneMs: ResourceStorageOperationUsageEntry;
  oneToTenMs: ResourceStorageOperationUsageEntry;
  tenToOneHundredMs: ResourceStorageOperationUsageEntry;
  oneHundredMsToOneS: ResourceStorageOperationUsageEntry;
  oneToTenS: ResourceStorageOperationUsageEntry;
  tenToOneHundredS: ResourceStorageOperationUsageEntry;
  oneHundredS: ResourceStorageOperationUsageEntry;
}
