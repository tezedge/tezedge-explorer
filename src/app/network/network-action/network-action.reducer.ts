import * as moment from 'moment-mini-ts';
import {NetworkAction} from '../../shared/types/network/network-action.type';
import {NetworkActionEntity} from '../../shared/types/network/network-action-entity.type';

const initialState: NetworkAction = {
  ids: [],
  entities: {},
  lastCursorId: 0,
  selected: {},
  filter: {
    local: false,
    remote: false,

    connection: false,
    meta: false,
    acknowledge: false,
    bootstrap: false,
    advertise: false,
    swap: false,
    deactivate: false,

    currentHead: false,
    currentBranch: false,
    operation: false,
    protocol: false,
    blockHeaders: false,
    blockOperations: false,
    blockOperationsHashes: false
  },
  stream: false,
  urlParams: '',
  activePage: {},
  pages: {}
};

export function reducer(state: NetworkAction = initialState, action): NetworkAction {
  switch (action.type) {

    // initialize or reset state
    case 'NETWORK_LOAD': {
      return initialState;
    }

    // add network url params
    // case 'NETWORK_ACTION_LOAD': {
    //   return {
    //     ...state,
    //     urlParams: action.payload.filter ? action.payload.filter : ''
    //   };
    // }

    case 'NETWORK_ACTION_START_SUCCESS':
    case 'NETWORK_ACTION_LOAD_SUCCESS': {
      const entities = setEntities(action, state);
      const activePage = setActivePage(entities, action);

      return {
        ...state,
        ids: setIds(action),
        entities,
        lastCursorId: setLastCursorId(action, state),
        activePage,
        pages: setPages(activePage, state),
        stream: action.type === 'NETWORK_ACTION_START_SUCCESS',
      };
    }

    case 'NETWORK_ACTION_FILTER': {
      const stateFilter = {
        ...state.filter,
        [action.payload]: !state.filter[action.payload]
      };

      return {
        ...initialState,
        filter: stateFilter
      };
    }

    case 'NETWORK_ACTION_STOP': {
      return {
        ...state,
        stream: false
      };
    }

    case 'NETWORK_ACTION_DETAILS_LOAD_SUCCESS': {
      return {
        ...state,
        selected: setDetails(action)
      };
    }

    default:
      return state;
  }
}

export function setDetails(action) {
  if (!action.payload) {
    return {};
  }

  const hexValues = action.payload.original_bytes ? setHexValues(action.payload.original_bytes) : [];
  const payload = {};

  if (action.payload.message && action.payload.message.length && action.payload.message[0].type) {
    this.payload = {...action.payload.message[0]};
    delete this.payload.type;
  } else {
    this.payload = action.payload;
    delete this.payload.error;
    delete this.payload.original_bytes;
  }

  return {
    id: action.payload.id,
    hexValues,
    payload,
    error: action.payload.error
  };
}

export function setIds(action): Array<number> {
  if (!action.payload.length) {
    return [];
  }

  return action.payload
    .map((item, index) => index)
    .sort((a, b) => a - b);
}

export function setEntities(action, state): { [id: string]: NetworkActionEntity } {
  return action.payload.length === 0 ?
    {} :
    action.payload
      .reduce((accumulator, networkAction) => {
        const virtualScrollId = setVirtualScrollId(action, state, accumulator);

        return {
          ...accumulator,
          [virtualScrollId]: {
            ...networkAction,
            id: virtualScrollId,
            originalId: networkAction.id,
            payload: networkAction.message,
            datetime: moment.utc(Math.ceil(networkAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
          }
        };
      }, {});
}

export function setLastCursorId(action, state): number {
  return action.payload.length - 1;
}

export function setHexValues(bytes): string[] {
  if (!bytes || !bytes.length) {
    return [];
  }
  return bytes.map((item) => {
    return item.toString(16).padStart(6, '0').toUpperCase();
  }) || [];
}

export function setVirtualScrollId(action, state, accumulator): number {
  const alreadySetRecords = Object.keys(accumulator);
  return action.payload.length - (alreadySetRecords.length + 1);
}

export function setActivePage(entities, action): any {
  if (!action.payload.length) {
    return {};
  }

  return {
    id: entities[action.payload.length - 1].originalId,
    start: entities[0],
    end: entities[action.payload.length - 1],
    numberOfRecords: action.payload.length
  };
}

export function setPages(activePage, state) {
  if (!activePage.id) {
    return {};
  }

  const pagesArray = Object.keys(state.pages)
    .sort((a, b) => Number(b) - Number(a));

  if (Number(pagesArray[0]) < Number(activePage.id)) {
    return {
      [activePage.id]: activePage
    };
  } else {
    return {
      ...state.pages,
      [activePage.id]: activePage
    };
  }

}


// filter network items according to traffic source
// export function networkActionSourceFilter(entity, filter) {
//
//     if (filter.local && filter.remote) {
//         return true;
//     }
//
//     // process all connection messages
//     if (entity.type === 'connection_message' && filter.connection) {
//
//         if (filter.local && !entity.incoming) { return true; }
//         if (filter.remote && entity.incoming) { return true; }
//
//     }
//
//     // process all meta messages
//     if (entity.type === 'metadata' && filter.metadata) {
//
//         if (filter.local && !entity.incoming) { return true; }
//         if (filter.remote && entity.incoming) { return true; }
//
//     }
//
//     // process all p2p messages
//     if (entity.type === 'p2p_message') {
//
//         if (filter.local) {
//
//             if (filter.bootstrap && entity.kind === 'bootstrap' && !entity.incoming) { return true; }
//
//             if (filter.current_head && entity.kind === 'get_current_head' && !entity.incoming) { return true; }
//             if (filter.current_head && entity.kind === 'current_head' && entity.incoming) { return true; }
//
//             if (filter.current_branch && entity.kind === 'get_current_branch' && !entity.incoming) { return true; }
//             if (filter.current_branch && entity.kind === 'current_branch' && entity.incoming) { return true; }
//
//             if (filter.block_headers && entity.kind === 'get_block_headers' && !entity.incoming) { return true; }
//             if (filter.block_headers && entity.kind === 'block_header' && entity.incoming) { return true; }
//
//             if (filter.block_operations && entity.kind === 'get_operations_for_blocks' && !entity.incoming) { return true; }
//             if (filter.block_operations && entity.kind === 'operations_for_blocks' && entity.incoming) { return true; }
//
//         }
//
//         if (filter.remote) {
//
//             if (filter.bootstrap && entity.kind === 'bootstrap' && entity.incoming) { return true; }
//
//             if (filter.current_head && entity.kind === 'get_current_head' && entity.incoming) { return true; }
//             if (filter.current_head && entity.kind === 'current_head' && !entity.incoming) { return true; }
//
//             if (filter.current_branch && entity.kind === 'get_current_branch' && entity.incoming) { return true; }
//             if (filter.current_branch && entity.kind === 'current_branch' && !entity.incoming) { return true; }
//
//             if (filter.block_headers && entity.kind === 'get_block_headers' && entity.incoming) { return true; }
//             if (filter.block_headers && entity.kind === 'block_header' && !entity.incoming) { return true; }
//
//             if (filter.block_operations && entity.kind === 'get_operations_for_blocks' && entity.incoming) { return true; }
//             if (filter.block_operations && entity.kind === 'operations_for_blocks' && !entity.incoming) { return true; }
//
//         }
//
//     }
//
//     return false;
// }
