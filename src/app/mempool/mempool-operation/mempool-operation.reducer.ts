import { State } from '@app/app.reducers';
import { MEMPOOL_OPERATION_LOAD_SUCCESS, MEMPOOL_OPERATION_STOP, MempoolOperationActions } from '@mempool/mempool-operation/mempool-operation.actions';
import { MempoolOperationState } from '@shared/types/mempool/operation/mempool-operation-state.type';

const initialState: MempoolOperationState = {
  mempoolOperations: []
};

export function reducer(state: MempoolOperationState = initialState, action: MempoolOperationActions): MempoolOperationState {

  switch (action.type) {

    case MEMPOOL_OPERATION_LOAD_SUCCESS: {
      return {
        mempoolOperations: [
          ...action.payload.applied
            .map((mem) => ({ status: 'applied', type: mem.contents[0].kind, ...mem })),
          ...action.payload.refused
            .map((mem) => ({ status: 'refused', type: mem[1].contents[0].kind, hash: mem[0], ...mem[1] })),
          ...action.payload.branch_refused
            .map((mem) => ({ status: 'branchRefused', type: mem[1].contents[0].kind, hash: mem[0], ...mem[1] })),
          ...action.payload.branch_delayed
            .map((mem) => ({ status: 'branchDelayed', type: mem[1].contents[0].kind, hash: mem[0], ...mem[1] })),
          ...action.payload.unprocessed
            .map((mem) => ({ status: 'unprocessed', type: mem[1].contents[0].kind, hash: mem[0], ...mem[1] })),
        ]
      };
    }

    case MEMPOOL_OPERATION_STOP: {
      return initialState;
    }

    default:
      return state;
  }
}

export const selectMempoolOperations = (state: State) => state.mempool.operationState.mempoolOperations;
