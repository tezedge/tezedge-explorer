import { NetworkActionEntity } from './network-action-entity.type';
import { NetworkActionFilter } from './network-action-filter.type';

export class NetworkAction {
  ids: number[];
  entities: { [id: string]: NetworkActionEntity };
  lastCursorId: number;
  selected: any; // TODO create a type
  filter: NetworkActionFilter;
  stream: boolean;
  urlParams: string;
  activePage: any; // TODO create a type
  pages: any; // TODO create a type
}
