import { NetworkActionEntity } from '@shared/types/network/network-action-entity.type';
import { LogsActionEntity } from '@shared/types/logs/logs-action-entity.type';
import { StorageBlockEntity } from '@shared/types/storage/storage-block/storage-block-entity.type';

export class VirtualScrollActivePage {
  id?: number;
  numberOfRecords?: number;
  start?: NetworkActionEntity
    | StorageBlockEntity
    | LogsActionEntity
  ; // the entity type of each list
  end?: NetworkActionEntity
    | StorageBlockEntity
    | LogsActionEntity
  ; // the entity type of each list
}
