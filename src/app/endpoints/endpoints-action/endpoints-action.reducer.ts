import * as moment from 'moment-mini-ts';

const initialState: any = {
    ids: [],
    entities: {},
    stream: false,
};

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'ENDPOINTS_ACTION_START_SUCCESS':
        case 'ENDPOINTS_ACTION_LOAD_SUCCESS': {

            return {
                ...state,
                ids: action.payload
                    .map(endpointAction => endpointAction.id),
                entities: action.payload
                    .reduce((accumulator, endpointAction) => {

                        const message = {
                            ...endpointAction.message,
                            payload: endpointAction.message.payload,
                        };

                        return {
                            ...accumulator,
                            [endpointAction.id]: {
                                ...endpointAction,
                                message: message,
                                preview: message.payload.length > 20 ? message.payload.substring(0, 20) + '...' : '',
                                datetime: moment.utc(Math.ceil(endpointAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY'),
                            },
                        };

                    }, {}),
                stream: true,
            };

        }

        case 'ENDPOINTS_ACTION_STOP': {
            return {
                ...state,
                stream: false
            };
        }

        default:
            return state;
    }
}
