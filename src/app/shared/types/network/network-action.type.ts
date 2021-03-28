import { NetworkActionEntity } from './network-action-entity.type';
import { NetworkActionFilter } from './network-action-filter.type';
import {VirtualScrollActivePage} from '../shared/virtual-scroll-active-page.type';

export class NetworkAction {
  ids: number[];
  entities: { [id: string]: NetworkActionEntity };
  lastCursorId: number;
  selected: any; // TODO create a type
  filter: NetworkActionFilter;
  stream: boolean;
  urlParams: string;
  activePage: VirtualScrollActivePage;
  pages: number[];
}
