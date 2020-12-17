import * as moment from 'moment-mini-ts';

const initialState: any = {
  ids: [],
  entities: {},
  positions: {},
  lastCursorId: 0,
  filter: {
    trace: false,
    debug: false,
    info: false,
    notice: false,
    warn: false,
    warning: false,
    error: false,
    fatal: false
  },
  stream: false
};

export function reducer(state = initialState, action) {
  switch (action.type) {

    case 'LOGS_ACTION_START_SUCCESS':
    case 'LOGS_ACTION_LOAD_SUCCESS': {
      return {
        ...state,
        ids: setIds(action),
        entities: setEntities(action),
        positions: setPositions(action, state),
        lastCursorId: setLastCursorId(action, state),
        stream: action.type === 'LOGS_ACTION_START_SUCCESS'
      };
    }

    case 'LOGS_ACTION_FILTER': {

      const stateFilter = {
        ...state.filter,
        [action.payload]: !state.filter[action.payload]
      };

      return {
        ...state,
        lastCursorId: 0,
        positions: {},
        filter: stateFilter
      };
    }

    case 'LOGS_ACTION_STOP': {
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
    .map(item => item.id)
    .sort((a, b) => a - b);
}

export function setEntities(action) {
  return action.payload
    .reduce((accumulator, logsAction) => {
      return {
        ...accumulator,
        [logsAction.id]: {
          ...logsAction,
          datetime: moment.utc(Math.ceil(logsAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
        }
      };
    }, {});
}

export function setLastCursorId(action, state) {
  return action.payload.length > 0 && state.lastCursorId < action.payload[0].id ?
    action.payload[0].id : state.lastCursorId;
}

export function setPositions(action, state) {
  const newPositions = {};

  for (let index = 0; index < action.payload.length; index++) {
    if (index === 0) {
      newPositions[action.payload[index].id] = state && Object.keys(state.positions).length !== 0 ?
        state.positions[action.payload[index].id] ? state.positions[action.payload[index].id] : state.positions[state.ids[state.ids.length - 1]] :
        action.payload[index].id;
    } else {
      newPositions[action.payload[index].id] = newPositions[action.payload[index - 1].id] - 1;
    }
  }

  return {
    ...state.positions,
    ...newPositions
  };
}
