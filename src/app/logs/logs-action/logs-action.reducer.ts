import * as moment from 'moment-mini-ts';

const initialState: any = {
  ids: [],
  idsFilter: [],
  entities: {},
  stream: false,
};

export function reducer(state = initialState, action) {
  switch (action.type) {

    case 'LOGS_ACTION_LOAD_SUCCESS':
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
                // preview: logsAction.message.length > 20 ? logsAction.message.substring(0, 80) + '...' : '',
                datetime: moment.utc(Math.ceil(logsAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY'),
              }
            };
          }, {}),
        stream: true,
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
