import { MempoolBlockApplicationState } from '@shared/types/mempool/block-application/mempool-block-application-state.type';
import {
  MEMPOOL_BLOCK_APPLICATION_LOAD,
  MEMPOOL_BLOCK_APPLICATION_LOAD_SUCCESS,
  MEMPOOL_BLOCK_APPLICATION_STOP,
  MempoolBlockApplicationActions
} from '@mempool/mempool-block-application/mempool-block-application.actions';
import { State } from '@app/app.reducers';
import { getFilteredXTicks } from '@helpers/chart.helper';

const initialState: MempoolBlockApplicationState = {
  chartLines: [],
  xTicksValues: [],
  xTicksValuesLength: null,
};

export function reducer(state: MempoolBlockApplicationState = initialState, action: MempoolBlockApplicationActions): MempoolBlockApplicationState {
  switch (action.type) {

    case MEMPOOL_BLOCK_APPLICATION_LOAD: {
      return {
        ...state,
        xTicksValuesLength: action.payload.xTicksValuesLength
      };
    }

    case MEMPOOL_BLOCK_APPLICATION_LOAD_SUCCESS: {
      const series = action.payload.chartLines[0].series;
      const xTicksValues = getFilteredXTicks(series, Math.min(series.length, state.xTicksValuesLength), 'name');

      return {
        ...state,
        chartLines: action.payload.chartLines,
        xTicksValues
      };
    }

    case MEMPOOL_BLOCK_APPLICATION_STOP: {
      return initialState;
    }

    default:
      return state;
  }
}

export const mempoolBlockApplication = (state: State): MempoolBlockApplicationState => state.mempool.blockApplicationState;
