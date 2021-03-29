import {NetworkActionEntity} from '../network/network-action-entity.type';

export class VirtualScrollActivePage {
  id?: number;
  numberOfRecords?: number;
  start?: NetworkActionEntity; // the entity type of each list
  end?: NetworkActionEntity; // the entity type of each list
}
