import { MempoolEndorsementState } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-state.type';
import { MempoolOperationState } from '@shared/types/mempool/operation/mempool-operation-state.type';
import { MempoolBroadcastState } from '@shared/types/mempool/broadcast/mempool-broadcast-state.type';
import { combineReducers } from '@ngrx/store';
import * as fromMempoolEndorsement from '@mempool/mempool-endorsement/mempool-endorsement.reducer';
import * as fromMempoolOperation from '@mempool/mempool-operation/mempool-operation.reducer';
import * as fromMempoolBroadcast from '@mempool/mempool-broadcast/mempool-broadcast.reducer';

export interface MempoolState {
  endorsementState: MempoolEndorsementState;
  operationState: MempoolOperationState;
  broadcastState: MempoolBroadcastState;
}

export const reducer = combineReducers<MempoolState>({
  endorsementState: fromMempoolEndorsement.reducer,
  operationState: fromMempoolOperation.reducer,
  broadcastState: fromMempoolBroadcast.reducer,
});
