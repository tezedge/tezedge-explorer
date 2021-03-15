import * as moment from 'moment-mini-ts';

const initialState: any = {
  ids: [],
  entities: {},
  lastCursorId: 0,
  firstRecordIndex: 0,
  stream: false,
  selected: {}
};

export function reducer(state = initialState, action) {
  switch (action.type) {

    // case 'STORAGE_BLOCK_LOAD': {
    //   return {
    //     ...state,
    //     stream: true
    //   };
    // }

    case 'STORAGE_BLOCK_START_SUCCESS':
    case 'STORAGE_BLOCK_LOAD_SUCCESS': {
      return {
        ...state,
        ids: setIds(action),
        entities: setEntities(state, action),
        lastCursorId: setLastCursorId(action, state),
        stream: action.type === 'STORAGE_BLOCK_START_SUCCESS'
      };
    }

    case 'STORAGE_BLOCK_STOP': {
      return {
        ...state,
        stream: false
      };
    }

    case 'STORAGE_BLOCK_DETAILS_LOAD_SUCCESS': {
      return {
        ...state,
        selected: action.payload
      };
    }

    case 'STORAGE_BLOCK_RESET_SUCCESS': {
      return {
        ...initialState
      };
    }

    default:
      return state;
  }
}

export function setIds(action) {
  return action.payload
    .map(item => item.level)
    .sort((a, b) => a - b);

}

export function setEntities(state, action) {
  return action.payload
    .reduce((accumulator, block) => ({
      ...accumulator,
      [block.level]: {
        hash: block.block_hash,
        id: block.level,
        datetime: moment.utc(Number(block.timestamp)).format('HH:mm:ss.SSS, DD MMM YY'),
        cyclePosition: block.cycle_position !== undefined ? block.cycle_position : ''
      }
    }), {});

  // return action.payload
  //   .reduce((accumulator, logsAction) => {
  //     return {
  //       ...accumulator,
  //       [logsAction.id]: {
  //         ...logsAction,
  //         datetime: moment.utc(Math.ceil(logsAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
  //       }
  //     };
  //   }, {});
}

export function setLastCursorId(action, state) {
  return action.payload.length > 0 && state.lastCursorId < action.payload[0].level ?
    action.payload[0].level : state.lastCursorId;
}
