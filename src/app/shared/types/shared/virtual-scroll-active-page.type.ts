import {NetworkActionEntity} from '../network/network-action-entity.type';
import {LogsActionEntity} from '../logs/logs-action-entity.type';
import {StorageBlockEntity} from '../storage/storage-block/storage-block-entity.type';

export class VirtualScrollActivePage {
  id?: number;
  numberOfRecords?: number;
  start?: NetworkActionEntity | StorageBlockEntity | LogsActionEntity; // the entity type of each list
  end?: NetworkActionEntity | StorageBlockEntity | LogsActionEntity; // the entity type of each list
}
