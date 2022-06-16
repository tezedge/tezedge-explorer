import { EmbeddedState } from '@app/embedded/embedded.index';
import {
  EMBEDDED_CHANGE_PAGE,
  EMBEDDED_CHANGE_STREAM,
  EMBEDDED_GET_STATE_SUCCESS,
  EMBEDDED_STOP,
  EmbeddedActions
} from '@app/embedded/embedded.actions';

const PAGES_LIMIT = 50;

const initialState: EmbeddedState = {
  pages: [],
  activePageIndex: 0,
  stream: true,
};

export function reducer(state: EmbeddedState = initialState, action: EmbeddedActions): EmbeddedState {
  switch (action.type) {

    case EMBEDDED_GET_STATE_SUCCESS: {
      const pages = [...state.pages.slice(state.pages.length === PAGES_LIMIT ? 1 : 0), action.payload.state];
      return {
        ...state,
        pages,
        activePageIndex: pages.length - 1
      };
    }

    case EMBEDDED_CHANGE_PAGE: {
      return {
        ...state,
        stream: false,
        activePageIndex: action.payload
      };
    }

    case EMBEDDED_CHANGE_STREAM: {
      return {
        ...state,
        stream: action.payload
      };
    }

    case EMBEDDED_STOP: {
      return initialState;
    }

    default:
      return state;
  }
}
