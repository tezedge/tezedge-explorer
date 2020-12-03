import * as moment from 'moment-mini-ts';

const initialState: any = {
  ids: [],
  idsFilter: [],
  entities: {},
  lastCursorId: 0,
  stream: false
};

export function reducer(state = initialState, action) {
  switch (action.type) {

    case 'LOGS_ACTION_START_SUCCESS': {
      return {
        ...state,
        ids: action.payload
          .map(logsAction => logsAction.id)
          .sort((a, b) => a - b),
        entities: action.payload
          .reduce((accumulator, logsAction) => {
            return {
              ...accumulator,
              [logsAction.id]: {
                ...logsAction,
                preview: logsAction.message,
                datetime: moment.utc(Math.ceil(logsAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
              }
            };
          }, {}),
        lastCursorId: action.payload.length > 0 && state.lastCursorId < action.payload[0].id ?
          action.payload[0].id : state.lastCursorId,
        stream: true
      };
    }

    case 'LOGS_ACTION_LOAD_SUCCESS': {
      return {
        ...state,
        ids: action.payload
          .map(logsAction => logsAction.id)
          .sort((a, b) => a - b),
        entities: action.payload
          .reduce((accumulator, logsAction) => {
            return {
              ...accumulator,
              [logsAction.id]: {
                ...logsAction,
                preview: logsAction.message,
                datetime: moment.utc(Math.ceil(logsAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
              }
            };
          }, {}),
        lastCursorId: action.payload.length > 0 && state.lastCursorId < action.payload[0].id ?
          action.payload[0].id : state.lastCursorId,
        stream: false
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
