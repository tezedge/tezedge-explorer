import { Resource } from '../models/resource';
import { ResourcesActions, ResourcesActionTypes } from './resources.actions';


export interface ResourcesState {
  resources: Resource[];
}

const initialState: ResourcesState = {
  resources: []
};

export function reducer(state: ResourcesState = initialState, action: ResourcesActions): ResourcesState {
  switch (action.type) {
    case ResourcesActionTypes.ResourcesLoadSuccess: {
      return {
        resources: action.payload
      };
    }
    default:
      return state;
  }
}

