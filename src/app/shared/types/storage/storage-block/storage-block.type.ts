import { VirtualScrollActivePage } from '../../shared/virtual-scroll-active-page.type';
import { StorageBlockEntity } from './storage-block-entity.type';
import { StorageBlockSelection } from './storage-block-selection.type';

export class StorageBlock {
  ids: number[];
  entities: { [id: string]: StorageBlockEntity };
  lastCursorId: number;
  stream: boolean;
  selected: StorageBlockSelection;
  activePage: VirtualScrollActivePage;
  pages: number[];
}
