import { State } from '@app/app.reducers';
import { MEMPOOL_BROADCAST_LOAD_SUCCESS, MEMPOOL_BROADCAST_STOP, MempoolBroadcastActions } from '@mempool/mempool-broadcast/mempool-broadcast.actions';
import { MempoolBroadcastState } from '@shared/types/mempool/broadcast/mempool-broadcast-state.type';

const initialState: MempoolBroadcastState = {
  mempoolOperations: []
};

export function reducer(state: MempoolBroadcastState = initialState, action: MempoolBroadcastActions): MempoolBroadcastState {

  switch (action.type) {

    case MEMPOOL_BROADCAST_LOAD_SUCCESS: {
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

    case MEMPOOL_BROADCAST_STOP: {
      return initialState;
    }

    default:
      return state;
  }
}

export const selectMempoolBroadcast = (state: State) => state.mempool.broadcastState.mempoolOperations;
