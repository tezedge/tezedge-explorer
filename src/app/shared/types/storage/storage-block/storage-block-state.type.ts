import { VirtualScrollActivePage } from '@shared/types/shared/virtual-scroll-active-page.type';
import { StorageBlockEntity } from './storage-block-entity.type';
import { StorageBlockSelection } from './storage-block-selection.type';
import { StorageBlockDetails } from './storage-block-details.type';

export class StorageBlockState {
  ids: number[];
  entities: { [id: string]: StorageBlockEntity };
  lastCursorId: number;
  stream: boolean;
  routedBlock: boolean;
  selected: StorageBlockSelection;
  blockDetails: StorageBlockDetails;
  availableContexts: string[];
  activePage: VirtualScrollActivePage<StorageBlockEntity>;
  pages: number[];
}
