import { VirtualScrollActivePage } from '../../shared/virtual-scroll-active-page.type';
import { StorageBlockEntity } from './storage-block-entity.type';
import { StorageBlockSelection } from './storage-block-selection.type';
import { StorageBlockDetails } from './storage-block-details.type';

export class StorageBlock {
  ids: number[];
  entities: { [id: string]: StorageBlockEntity };
  lastCursorId: number;
  stream: boolean;
  selected: StorageBlockSelection;
  blockDetails: StorageBlockDetails;
  availableContexts: string[];
  activePage: VirtualScrollActivePage;
  pages: number[];
}
