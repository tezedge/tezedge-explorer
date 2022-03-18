import { StorageBlockState } from '@shared/types/storage/storage-block/storage-block-state.type';
import { StorageRequestState } from '@storage/storage-request/storage-request.index';

export interface StorageState {
  blockState: StorageBlockState;
  requestState: StorageRequestState;
}
