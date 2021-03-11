import * as moment from 'moment-mini-ts';

const initialState: any = {
  ids: [],
  entities: {},
  lastCursorId: 0,
  indexToId: {},
  idToIndex: {},
  isFiltered: false,
  filter: {
    local: false,
    remote: false,

    meta: false,
    connection: false,
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
  urlParams: ''
};

export function reducer(state = initialState, action) {
  switch (action.type) {

    // initialize or reset state
    case 'NETWORK_INIT': {
      return initialState;
    }

    // add network url params
    case 'NETWORK_ACTION_LOAD': {
      return {
        ...state,
        urlParams: action.payload.filter ? action.payload.filter : ''
      };
    }

    case 'NETWORK_ACTION_START_SUCCESS':
    case 'NETWORK_ACTION_LOAD_SUCCESS': {
      return {
        ...state,
        ids: setIds(action),
        entities: setEntities(action, state),
        indexToId: setIndexToId(action, state),
        idToIndex: setIdToIndex(action, state),
        lastCursorId: setLastCursorId(action, state),
        isFiltered: setIsFiltered(state),
        stream: action.type === 'NETWORK_ACTION_START_SUCCESS'
      };
    }

    case 'NETWORK_ACTION_FILTER': {
      const stateFilter = {
        ...state.filter,
        [action.payload]: !state.filter[action.payload]
      };

      const result = {
        ...state,
        lastCursorId: 0,
        indexToId: {},
        idToIndex: {},
        filter: stateFilter
      };

      return {
        ...result,
        isFiltered: setIsFiltered(result)
      };
    }

    case 'NETWORK_ACTION_STOP': {
      return {
        ...state,
        stream: false
      };
    }

    default:
      return state;
  }
}

export function setIds(action): Array<number> {
  return action.payload.length === 0 ?
    [] :
    action.payload
      .map(item => item.id)
      // .map(item => item.id)
      .sort((a, b) => a - b);
}

// export function setIds(action, state): Array<number> {
//   if (!action.payload.length) {
//     return [];
//   }
//
//   const biggestIndex = Math.max(action.payload[0].id, state.lastCursorId);
//
//   return action.payload
//       .map((item, index) => biggestIndex - index)
//       // .map(item => item.id)
//       .sort((a, b) => a - b);
// }

export function setEntities(action, state): object {
  return action.payload.length === 0 ?
    {} :
    action.payload
      .reduce((accumulator, networkAction) => {
        // if (networkAction.type === 'metadata') {
        //
        //   return {
        //     ...accumulator,
        //     [networkAction.id]: {
        //       ...networkAction,
        //       category: 'Meta',
        //       kind: '',
        //       payload: networkAction.message,
        //       preview: JSON.stringify(networkAction.message),
        //       datetime: moment.utc(Math.ceil(networkAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
        //     }
        //   };
        // }
        //
        // if (networkAction.type === 'connection_message') {
        //
        //   return {
        //     ...accumulator,
        //     [networkAction.id]: {
        //       ...networkAction,
        //       category: 'Connection',
        //       kind: '',
        //       payload: networkAction.message,
        //       preview: JSON.stringify(networkAction.message),
        //       datetime: moment.utc(Math.ceil(networkAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
        //     }
        //   };
        // }

        // if (networkAction.type === 'p2p_message') {
        const hexValues = setHexValues(networkAction.original_bytes);
        const virtualScrollId = setVirtualScrollId(networkAction, state, accumulator);
        console.log(virtualScrollId);

        if (networkAction.message && networkAction.message.length && networkAction.message[0].type) {
          const payload = {...networkAction.message[0]};
          delete payload.type;

          return {
            ...accumulator,
            [virtualScrollId]: {
              ...networkAction,
              hexValues,
              id: virtualScrollId,
              originalId: networkAction.id,
              category: 'P2P',
              kind: networkAction.message[0].type,
              payload,
              preview: JSON.stringify(networkAction.message),
              datetime: moment.utc(Math.ceil(networkAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
            }
          };
        } else {
          return {
            ...accumulator,
            [virtualScrollId]: {
              ...networkAction,
              hexValues,
              id: virtualScrollId,
              originalId: networkAction.id,
              payload: networkAction.message,
              datetime: moment.utc(Math.ceil(networkAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
            }
          };
        }
        // }

        // return {
        //   ...accumulator,
        //   [networkAction.id]: {
        //     ...networkAction,
        //     payload: networkAction.message,
        //     preview: JSON.stringify(networkAction.message), // needs to remain or not ???
        //     datetime: moment.utc(Math.ceil(networkAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
        //
        //   }
        // };

      }, {});
}

export function setLastCursorId(action, state): number {
  return action.payload.length > 0 && state.lastCursorId < action.payload[0].id ?
    action.payload[0].id : state.lastCursorId;
}

export function setHexValues(bytes): Array<string> {
  if (!bytes || !bytes.length) {
    return [];
  }
  return bytes.map((item) => {
    return item.toString(16).padStart(6, '0').toUpperCase();
  }) || [];
}

export function setIdToIndex(action, state): object {
  const idToIndexLocal = {};
  let result = {};

  if (!Object.keys(state.idToIndex).length || action.type === 'NETWORK_ACTION_START_SUCCESS') {
    // it means that we are initializing the idToIndex
    for (let index = 0; index < action.payload.length; index++) {
      idToIndexLocal[action.payload[index].id] = index === 0 ? action.payload[0].id : idToIndexLocal[action.payload[index - 1].id] - 1;
    }

    result = idToIndexLocal;

  } else {
    const indexOfTheBiggestId = state.idToIndex[action.payload[0].id];
    for (let index = 0; index < action.payload.length; index++) {
      idToIndexLocal[action.payload[index].id] = indexOfTheBiggestId - index;
    }

    result = {
      ...state.idToIndex,
      ...idToIndexLocal
    };
  }

  return result;
}

export function setIndexToId(action, state): object {
  const indexToIdLocal = {};
  let result = {};

  if (!Object.keys(state.indexToId).length || action.type === 'NETWORK_ACTION_START_SUCCESS') {
    for (let index = 0; index < action.payload.length; index++) {
      indexToIdLocal[action.payload[0].id - index] = action.payload[index].id;
    }

    result = indexToIdLocal;
  } else {
    const indexOfTheBiggestId = state.idToIndex[action.payload[0].id];
    for (let index = 0; index < action.payload.length; index++) {
      indexToIdLocal[indexOfTheBiggestId - index] = action.payload[index].id;
    }

    result = {
      ...state.idToIndex,
      ...indexToIdLocal
    };
  }

  return result;
}

export function setVirtualScrollId(action, state, accumulator): number {
  if (!state.isFiltered) {
    return action.id;
  }
  debugger;
  // if (!Object.keys(accumulator).length) {
  //   // first element
  const alreadySetRecords = Object.keys(accumulator);
  const indexOfBiggestRecord = !alreadySetRecords.length ? (state.idToIndex[action.id] || action.id) : alreadySetRecords[alreadySetRecords.length - 1];
  return indexOfBiggestRecord - alreadySetRecords.length;
  // }
}

export function setIsFiltered(state): boolean {
  return Object.values(state.filter).includes(true);
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
