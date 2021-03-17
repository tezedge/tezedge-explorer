import { ResourcesActions, ResourcesActionTypes } from './resources.actions';
import { ResourcesState } from '../../shared/types/resources/resources-state.type';

const initialState: ResourcesState = {
  resources: []
};

export function reducer(state: ResourcesState = initialState, action: ResourcesActions): ResourcesState {
  switch (action.type) {
    case ResourcesActionTypes.ResourcesLoadSuccess: {
      return {
        resources: [...action.payload]
      };
    }
    default:
      return state;
  }
}

