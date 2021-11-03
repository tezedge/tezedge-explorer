import { MempoolBlockApplicationState } from '@shared/types/mempool/block-application/mempool-block-application-state.type';
import {
  MEMPOOL_BLOCK_APPLICATION_DELTA_SWITCH,
  MEMPOOL_BLOCK_APPLICATION_DETAILS_LOAD,
  MEMPOOL_BLOCK_APPLICATION_DETAILS_LOAD_SUCCESS,
  MEMPOOL_BLOCK_APPLICATION_LOAD,
  MEMPOOL_BLOCK_APPLICATION_LOAD_SUCCESS,
  MEMPOOL_BLOCK_APPLICATION_STOP,
  MempoolBlockApplicationActions
} from '@mempool/mempool-block-application/mempool-block-application.actions';
import { State } from '@app/app.reducers';
import { getFilteredXTicks } from '@helpers/chart.helper';
import { MempoolBlockApplicationChartLine } from '@shared/types/mempool/block-application/mempool-block-application-chart-line.type';
import { MempoolBlockDetails } from '@shared/types/mempool/common/mempool-block-details.type';

const initialState: MempoolBlockApplicationState = {
  chartLines: [],
  xTicksValues: [],
  xTicksValuesLength: null,
  averageValues: [],
  noOfBlocks: null,
  activeBlockLevel: null,
  bakingDetails: [],
  delta: true,
  colorScheme: ['#46afe3', '#ff9f0a', '#ffd60a', '#32d74b', '#bf5af2']
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
      const averageValues = action.payload.chartLines.map((line: MempoolBlockApplicationChartLine) => ({
        name: line.name,
        value: line.series.reduce((a, b) => a + b.value, 0) / line.series.length
      }));

      return {
        ...state,
        chartLines: action.payload.chartLines,
        noOfBlocks: series.length,
        xTicksValues,
        averageValues
      };
    }

    case MEMPOOL_BLOCK_APPLICATION_DETAILS_LOAD: {
      return {
        ...state,
        activeBlockLevel: action.payload.level
      };
    }

    case MEMPOOL_BLOCK_APPLICATION_DETAILS_LOAD_SUCCESS: {
      return {
        ...state,
        bakingDetails: action.payload.details
      };
    }

    case MEMPOOL_BLOCK_APPLICATION_DELTA_SWITCH: {
      return {
        ...state,
        delta: !state.delta
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
export const mempoolBlockApplicationActiveBlockLevel = (state: State): number => state.mempool.blockApplicationState.activeBlockLevel;
export const mempoolBlockApplicationActiveBlockDetails = (state: State): MempoolBlockDetails[] => state.mempool.blockApplicationState.bakingDetails;
export const mempoolBlockApplicationDelta = (state: State): boolean => state.mempool.blockApplicationState.delta;
