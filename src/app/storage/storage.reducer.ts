import { combineReducers } from '@ngrx/store';
import * as fromStorageBlock from '@storage/storage-block/storage-block.reducer';
import * as fromStorageRequest from '@storage/storage-request/storage-request.reducer';
import { StorageState } from '@storage/storage.index';

export const reducer = combineReducers<StorageState>({
  blockState: fromStorageBlock.reducer,
  requestState: fromStorageRequest.reducer,
});
