import {VirtualScrollActivePage} from '../shared/virtual-scroll-active-page.type';
import {LogsActionFilter} from './logs-action-filter.type';
import {LogsActionEntity} from './logs-action-entity.type';

export class LogsAction {
  ids: number[];
  entities: { [id: string]: LogsActionEntity };
  lastCursorId: number;
  filter: LogsActionFilter;
  stream: boolean;
  activePage: VirtualScrollActivePage;
  pages: number[];
}
