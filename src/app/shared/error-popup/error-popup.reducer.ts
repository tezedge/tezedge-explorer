import { HttpError } from '@shared/types/shared/error-popup/http-error.type';
import { ADD_ERROR, REMOVE_ERROR, ErrorActions } from './error-popup.actions';
import { State } from '@app/app.reducers';

export interface ErrorState {
  errors: HttpError[];
}

const initialState: ErrorState = {
  errors: []
};

export function reducer(state: ErrorState = initialState, action: ErrorActions): ErrorState {
  switch (action.type) {
    case ADD_ERROR: {
      return {
        errors: state.errors.findIndex(err => err.title === action.payload.title && err.message === action.payload.message) !== -1
          ? state.errors
          : [action.payload, ...state.errors]
      };
    }
    case REMOVE_ERROR: {
      return {
        errors: state.errors.length ? state.errors.slice(0, -1) : state.errors
      };
    }
    default:
      return state;
  }
}

export const selectNewError = (state: State) => state.error.errors[0];
