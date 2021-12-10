import { MemoryResourcesActions, MemoryResourcesActionTypes } from '@resources/memory-resources/memory-resources.actions';
import { State } from '@app/app.reducers';
import { MemoryResourcesState } from '@shared/types/resources/memory/memory-resources-state.type';


const initialState: MemoryResourcesState = {
  memoryResources: null
};

export function reducer(state: MemoryResourcesState = initialState, action: MemoryResourcesActions): MemoryResourcesState {
  switch (action.type) {

    case MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD_SUCCESS: {
      return {
        memoryResources: { ...action.payload }
      };
    }

    case MemoryResourcesActionTypes.MEMORY_RESOURCES_CLOSE: {
      return initialState;
    }

    default:
      return state;
  }
}

export const memoryResources = (state: State) => state.resources.memoryResourcesState.memoryResources;
