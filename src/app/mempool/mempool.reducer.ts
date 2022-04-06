import { MempoolEndorsementState } from '@shared/types/mempool/endorsement/mempool-endorsement-state.type';
import { MempoolOperationState } from '@shared/types/mempool/operation/mempool-operation-state.type';
import { MempoolStatisticsState } from '@shared/types/mempool/statistics/mempool-statistics-state.type';
import { MempoolBlockApplicationState } from '@shared/types/mempool/block-application/mempool-block-application-state.type';
import { MempoolBakingRightsState } from '@shared/types/mempool/baking-rights/mempool-baking-rights-state.type';
import { combineReducers } from '@ngrx/store';
import * as fromMempoolEndorsement from '@mempool/endorsements/mempool-endorsement/mempool-endorsement.reducer';
import * as fromMempoolPreEndorsement from '@mempool/preendorsements/mempool-pre-endorsement/mempool-pre-endorsement.reducer';
import * as fromMempoolOperation from '@mempool/operation/mempool-operation/mempool-operation.reducer';
import * as fromMempoolStatistics from '@mempool/statistics/mempool-statistics/mempool-statistics.reducer';
import * as fromMempoolBlockApplication from '@mempool/block-application/mempool-block-application/mempool-block-application.reducer';
import * as fromMempoolBakingRights from '@mempool/baking-rights/mempool-baking-rights/mempool-baking-rights.reducer';
import { ActionReducer } from '@ngrx/store/src/models';
import { MempoolPreEndorsementState } from '@shared/types/mempool/preendorsement/mempool-preendorsement-state.type';

export interface MempoolState {
  endorsementState: MempoolEndorsementState;
  preendorsementState: MempoolPreEndorsementState;
  operationState: MempoolOperationState;
  statisticsState: MempoolStatisticsState;
  blockApplicationState: MempoolBlockApplicationState;
  bakingRightsState: MempoolBakingRightsState;
}

export const reducer: ActionReducer<MempoolState> = combineReducers<MempoolState>({
  endorsementState: fromMempoolEndorsement.reducer,
  preendorsementState: fromMempoolPreEndorsement.reducer,
  operationState: fromMempoolOperation.reducer,
  statisticsState: fromMempoolStatistics.reducer,
  blockApplicationState: fromMempoolBlockApplication.reducer,
  bakingRightsState: fromMempoolBakingRights.reducer,
});
