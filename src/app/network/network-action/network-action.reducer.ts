import * as moment from 'moment-mini-ts';

const initialState: any = {
  ids: [],
  entities: {},
  idsToPositions: {},
  positionsToIds: {},
  lastCursorId: 0,
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
        entities: setEntities(action),
        idsToPositions: setIdsToPositions(action, state),
        positionsToIds: setPositionsToIds(action, state),
        lastCursorId: setLastCursorId(action, state),
        stream: action.type === 'NETWORK_ACTION_START_SUCCESS'
      };
    }

    case 'NETWORK_ACTION_FILTER': {
      const stateFilter = {
        ...state.filter,
        [action.payload]: !state.filter[action.payload]
      };

      return {
        ...state,
        lastCursorId: 0,
        idsToPositions: {},
        positionsToIds: {},
        filter: stateFilter
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

export function setIds(action) {
  return action.payload.length === 0 ?
    [] :
    action.payload
      .map(item => item.id)
      .sort((a, b) => a - b);
}

export function setEntities(action) {
  return action.payload.length === 0 ?
    {} :
    action.payload
      .reduce((accumulator, networkAction) => {

        if (networkAction.type === 'metadata') {

          return {
            ...accumulator,
            [networkAction.id]: {
              ...networkAction,
              category: 'Meta',
              kind: '',
              payload: networkAction.message,
              preview: JSON.stringify(networkAction.message),
              datetime: moment.utc(Math.ceil(networkAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
            }
          };
        }

        if (networkAction.type === 'connection_message') {

          return {
            ...accumulator,
            [networkAction.id]: {
              ...networkAction,
              category: 'Connection',
              kind: '',
              payload: networkAction.message,
              preview: JSON.stringify(networkAction.message),
              datetime: moment.utc(Math.ceil(networkAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
            }
          };
        }

        if (networkAction.type === 'p2p_message') {

          const payload = { ...networkAction.message[0] };
          delete payload.type;

          return {
            ...accumulator,
            [networkAction.id]: {
              ...networkAction,
              category: 'P2P',
              kind: networkAction.message[0].type,
              payload,
              preview: JSON.stringify(networkAction.message),
              datetime: moment.utc(Math.ceil(networkAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
            }
          };
        }

        // console.log("[default]", networkAction);

        return {
          ...accumulator,
          [networkAction.id]: {
            ...networkAction,
            payload: networkAction.message,
            preview: JSON.stringify(networkAction.message), // needs to remain or not ???
            datetime: moment.utc(Math.ceil(networkAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')

          }
        };

      }, {});
}

export function setLastCursorId(action, state) {
  return action.payload.length > 0 && state.lastCursorId < action.payload[0].id ?
    action.payload[0].id : state.lastCursorId;
}

export function setIdsToPositions(action, state) {
  const newIdsToPositions = {};

  for (let index = 0; index < action.payload.length; index++) {
    if (index === 0) {
      newIdsToPositions[action.payload[index].id] = state && Object.keys(state.idsToPositions).length !== 0 ?
        state.idsToPositions[action.payload[index].id] ? state.idsToPositions[action.payload[index].id] : state.idsToPositions[state.ids[state.ids.length - 1]] :
        action.payload[index].id;
    } else {
      newIdsToPositions[action.payload[index].id] = newIdsToPositions[action.payload[index - 1].id] - 1;
    }
  }

  return action.payload && action.payload[0].id > state.lastCursorId ?
    { ...newIdsToPositions } :
    { ...state.idsToPositions, ...newIdsToPositions };
}

export function setPositionsToIds(action, state) {
  const newPositionsToIds = {};
  let currentPosition = null;

  for (let index = 0; index < action.payload.length; index++) {
    if (index === 0) {
      currentPosition = state && Object.keys(state.idsToPositions).length !== 0 ?
        state.idsToPositions[action.payload[index].id] ? state.idsToPositions[action.payload[index].id] : state.idsToPositions[state.ids[state.ids.length - 1]] :
        action.payload[index].id;
      newPositionsToIds[currentPosition] = action.payload[index].id;
    } else {
      currentPosition--;
      newPositionsToIds[currentPosition] = action.payload[index].id;
    }
  }

  console.log({ ...state.positionsToIds, ...newPositionsToIds });

  return action.payload && action.payload[0].id > state.lastCursorId ?
    { ...newPositionsToIds } :
    { ...state.positionsToIds, ...newPositionsToIds };
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
