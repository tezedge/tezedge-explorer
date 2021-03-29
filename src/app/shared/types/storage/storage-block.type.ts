import {VirtualScrollActivePage} from '../shared/virtual-scroll-active-page.type';
import {StorageBlockEntity} from './storage-block-entity.type';

export class StorageBlock {
  ids: number[];
  entities: { [id: string]: StorageBlockEntity };
  lastCursorId: number;
  stream: boolean;
  selected: any;
  activePage: VirtualScrollActivePage;
  pages: number[];
}
