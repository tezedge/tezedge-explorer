import { MemoryResourcesActions, MemoryResourcesActionTypes } from '@resources/memory-resources/memory-resources.actions';
import { State } from '@app/app.reducers';
import { MemoryResource } from '@shared/types/resources/memory/memory-resource.type';


const initialState: MemoryResource = null;

export function reducer(state: MemoryResource = initialState, action: MemoryResourcesActions): MemoryResource {
  switch (action.type) {

    case MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD_SUCCESS: {
      return {
        ...action.payload
      };
    }

    case MemoryResourcesActionTypes.MEMORY_RESOURCES_CLOSE: {
      return initialState;
    }

    default:
      return state;
  }
}

export const memoryResources = (state: State) => state.resources.memoryResources;
