import { MempoolBlockApplicationState } from '@shared/types/mempool/block-application/mempool-block-application-state.type';
import { MEMPOOL_BLOCK_APPLICATION_LOAD_SUCCESS } from '@mempool/mempool-block-application/mempool-block-application.actions';
import { State } from '@app/app.reducers';

const initialState: MempoolBlockApplicationState = {
  applicationBlocks: [],
};

export function reducer(state: MempoolBlockApplicationState = initialState, action: any): MempoolBlockApplicationState {
  switch (action.type) {

    case MEMPOOL_BLOCK_APPLICATION_LOAD_SUCCESS: {
      return {
        ...state,
        applicationBlocks: action.payload.blocks
      };
    }

    default:
      return state;
  }
}

export const mempoolBlockApplication = (state: State): MempoolBlockApplicationState => state.mempool.blockApplicationState;
