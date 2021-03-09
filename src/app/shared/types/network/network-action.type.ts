import { NetworkActionEntity } from './network-action-entity.type';
import { NetworkActionFilter } from './network-action-filter.type';

export class NetworkAction {
  ids: number[];
  entities: { [id: string]: NetworkActionEntity };
  lastCursorId: number;
  filter: NetworkActionFilter;
  stream: boolean;
  urlParams: string;
}
