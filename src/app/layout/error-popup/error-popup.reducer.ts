import { HttpError } from '@shared/types/shared/error-popup/http-error.type';
import { ADD_ERROR, ADD_INFO, PopupActions, REMOVE_ERROR, REMOVE_INFO } from './error-popup.actions';
import { State } from '@app/app.index';

export interface ErrorState {
  errors: HttpError[];
  info: string[];
}

const initialState: ErrorState = {
  errors: [],
  info: []
};

export function reducer(state: ErrorState = initialState, action: PopupActions): ErrorState {
  switch (action.type) {

    case ADD_ERROR: {
      return {
        ...state,
        errors: state.errors.findIndex(err => err.title === action.payload.title && err.message === action.payload.message) !== -1
          ? state.errors
          : [action.payload, ...state.errors]
      };
    }

    case ADD_INFO: {
      return {
        ...state,
        info: state.info.findIndex(inf => inf === action.payload) !== -1
          ? state.info
          : [action.payload, ...state.info]
      };
    }

    case REMOVE_ERROR: {
      return {
        ...state,
        errors: state.errors.length ? state.errors.slice(0, -1) : state.errors
      };
    }

    case REMOVE_INFO: {
      return {
        ...state,
        info: state.info.length ? state.info.slice(0, -1) : state.info
      };
    }

    default:
      return state;
  }
}

export const selectNewError = (state: State): HttpError => state.error.errors[0];
export const selectNewInfo = (state: State): string => state.error.info[0];
