import { MempoolEndorsementState } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-state.type';
import { MempoolOperationState } from '@shared/types/mempool/operation/mempool-operation-state.type';
import { combineReducers } from '@ngrx/store';
import * as fromMempoolEndorsement from '@mempool/mempool-endorsement/mempool-endorsement.reducer';
import * as fromMempoolOperation from '@mempool/mempool-operation/mempool-operation.reducer';

export interface MempoolState {
  endorsementState: MempoolEndorsementState;
  operationState: MempoolOperationState;
}

export const reducer = combineReducers<MempoolState>({
  endorsementState: fromMempoolEndorsement.reducer,
  operationState: fromMempoolOperation.reducer,
});
