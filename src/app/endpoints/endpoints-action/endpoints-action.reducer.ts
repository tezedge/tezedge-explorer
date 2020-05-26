import * as moment from 'moment-mini-ts';

const initialState: any = {
    ids: [],
    idsFilter: [],
    entities: {},
};

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'ENDPOINTS_ACTION_LOAD_SUCCESS': {

            // console.log('[ENDPOINTS_ACTION_LOAD_SUCCESS]', action );

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

                        // console.log('[ENDPOINTS_ACTION_LOAD_SUCCESS]', endpointAction.message );

                        // try() {}
                        // debugger

                        return {
                            ...accumulator,
                            [endpointAction.id]: {
                                ...endpointAction,
                                message: message,
                                preview: message.payload.length > 20 ? message.payload.substring(0, 20) + '...' : '',
                                datetime: moment.utc(Math.ceil(endpointAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY'),
                            }
                        };

                    }, {}),
            };
        }

        default:
            return state;
    }
}
