import * as moment from 'moment-mini-ts';

const initialState: any = {
  ids: [],
  entities: {},
  lastCursorId: 0,
  stream: false
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

    default:
      return state;
  }
}

export function setIds(action) {
  return action.payload
    .map(item => item.header.level)
    .sort((a, b) => a - b);

}

export function setEntities(state, action) {
  return action.payload
    .reduce((accumulator, block) => ({
      ...accumulator,
      [block.header.level]: {
        // ...state.entities[block.hash],
        ...block,
        id: block.header.level,
        datetime: moment.utc(block.header.timestamp).format('HH:mm:ss.SSS, DD MMM YY')
        // datetime: moment(block.header.timestamp).format('HH:mm:ss,  DD MMM YYYY')
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
  return action.payload.length > 0 && state.lastCursorId < action.payload[0].header.level ?
    action.payload[0].header.level : state.lastCursorId;
}
