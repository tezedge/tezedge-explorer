import { ActionReducer } from '@ngrx/store/src/models';
import { combineReducers } from '@ngrx/store';

import { MempoolEndorsementState } from '@mempool/consensus/endorsements/mempool-endorsement/mempool-endorsement.index';
import { MempoolOperationState } from '@shared/types/mempool/operation/mempool-operation-state.type';
import { MempoolStatisticsState } from '@shared/types/mempool/statistics/mempool-statistics-state.type';
import { MempoolBlockApplicationState } from '@shared/types/mempool/block-application/mempool-block-application-state.type';
import { MempoolConsensusState } from '@mempool/consensus/mempool-consensus.index';
import { MempoolBakingRightsState } from '@mempool/consensus/baking-rights/mempool-baking-rights/mempool-baking-rights.index';

import * as fromMempoolEndorsement from '@mempool/consensus/endorsements/mempool-endorsement/mempool-endorsement.reducer';
import * as fromMempoolOperation from '@mempool/operation/mempool-operation/mempool-operation.reducer';
import * as fromMempoolStatistics from '@mempool/statistics/mempool-statistics/mempool-statistics.reducer';
import * as fromMempoolBlockApplication from '@mempool/block-application/mempool-block-application/mempool-block-application.reducer';
import * as fromMempoolBakingRights from '@mempool/consensus/baking-rights/mempool-baking-rights/mempool-baking-rights.reducer';
import * as fromMempoolConsensus from '@mempool/consensus/mempool-consensus.reducer';

export interface MempoolState {
  blockApplicationState: MempoolBlockApplicationState;
  bakingRightsState: MempoolBakingRightsState;
  consensusState: MempoolConsensusState;
  endorsementState: MempoolEndorsementState;
  operationState: MempoolOperationState;
  statisticsState: MempoolStatisticsState;
}

export const reducer: ActionReducer<MempoolState> = combineReducers<MempoolState>({
  blockApplicationState: fromMempoolBlockApplication.reducer,
  bakingRightsState: fromMempoolBakingRights.reducer,
  consensusState: fromMempoolConsensus.reducer,
  endorsementState: fromMempoolEndorsement.reducer,
  operationState: fromMempoolOperation.reducer,
  statisticsState: fromMempoolStatistics.reducer,
});
