import { NetworkActionEntity } from './network-action-entity.type';
import { NetworkActionFilter } from './network-action-filter.type';

export class NetworkAction {
  ids: number[];
  entities: { [id: string]: NetworkActionEntity };
  // entities: any;
  lastCursorId: number;
  firstRecordIndex: number;
  filter: NetworkActionFilter;
  isFiltered: boolean;
  indexToId: object;
  idToIndex: object;
  stream: boolean;
  urlParams: string;
}
