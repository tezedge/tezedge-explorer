import { MempoolEndorsementState } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-state.type';
import { MempoolOperationState } from '@shared/types/mempool/operation/mempool-operation-state.type';
import { MempoolBroadcastState } from '@shared/types/mempool/broadcast/mempool-broadcast-state.type';
import { MempoolStatisticsState } from '@shared/types/mempool/statistics/mempool-statistics-state.type';
import { MempoolBlockApplicationState } from '@shared/types/mempool/block-application/mempool-block-application-state.type';
import { MempoolBakingRightsState } from '@shared/types/mempool/baking-rights/mempool-baking-rights-state.type';
import { combineReducers } from '@ngrx/store';
import * as fromMempoolEndorsement from '@mempool/mempool-endorsement/mempool-endorsement.reducer';
import * as fromMempoolOperation from '@mempool/mempool-operation/mempool-operation.reducer';
import * as fromMempoolBroadcast from '@mempool/mempool-broadcast/mempool-broadcast.reducer';
import * as fromMempoolStatistics from '@mempool/mempool-statistics/mempool-statistics.reducer';
import * as fromMempoolBlockApplication from '@mempool/mempool-block-application/mempool-block-application.reducer';
import * as fromMempoolBakingRights from '@mempool/mempool-baking-rights/mempool-baking-rights.reducer';

export interface MempoolState {
  endorsementState: MempoolEndorsementState;
  operationState: MempoolOperationState;
  broadcastState: MempoolBroadcastState;
  statisticsState: MempoolStatisticsState;
  blockApplicationState: MempoolBlockApplicationState;
  bakingRightsState: MempoolBakingRightsState;
}

export const reducer = combineReducers<MempoolState>({
  endorsementState: fromMempoolEndorsement.reducer,
  operationState: fromMempoolOperation.reducer,
  broadcastState: fromMempoolBroadcast.reducer,
  statisticsState: fromMempoolStatistics.reducer,
  blockApplicationState: fromMempoolBlockApplication.reducer,
  bakingRightsState: fromMempoolBakingRights.reducer,
});
