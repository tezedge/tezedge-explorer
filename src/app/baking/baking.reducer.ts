import { BakingState } from '@baking/baking.index';
import {
  BAKING_CHANGE_PAGE,
  BAKING_CHANGE_STREAM,
  BAKING_GET_STATE_SUCCESS,
  BAKING_STOP,
  BakingActions
} from '@app/baking/baking.actions';

const PAGES_LIMIT = 50;

const initialState: BakingState = {
  pages: [],
  activePageIndex: 0,
  stream: true,
};

export function reducer(state: BakingState = initialState, action: BakingActions): BakingState {
  switch (action.type) {

    case BAKING_GET_STATE_SUCCESS: {
      const pages = [...state.pages.slice(state.pages.length === PAGES_LIMIT ? 1 : 0), action.payload.state];
      return {
        ...state,
        pages,
        activePageIndex: pages.length - 1
      };
    }

    case BAKING_CHANGE_PAGE: {
      return {
        ...state,
        stream: false,
        activePageIndex: action.payload
      };
    }

    case BAKING_CHANGE_STREAM: {
      return {
        ...state,
        stream: action.payload
      };
    }

    case BAKING_STOP: {
      return initialState;
    }

    default:
      return state;
  }
}
