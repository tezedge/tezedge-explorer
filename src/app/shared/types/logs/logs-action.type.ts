import { VirtualScrollActivePage } from '@shared/types/shared/virtual-scroll-active-page.type';
import { LogsActionFilter } from './logs-action-filter.type';
import { LogsActionEntity } from './logs-action-entity.type';

export class LogsAction {
  ids: number[];
  entities: { [id: string]: LogsActionEntity };
  filter: LogsActionFilter;
  activePage: VirtualScrollActivePage<LogsActionEntity>;
  pages: number[];
  lastCursorId: number;
  stream: boolean;
  timestamp: number;
}
