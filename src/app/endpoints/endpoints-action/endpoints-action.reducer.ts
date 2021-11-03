import { toReadableDate } from '@helpers/date.helper';

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
                    .map(endpointAction => endpointAction.id)
                    .sort((a, b) => a - b),
                entities: action.payload
                    .reduce((accumulator, endpointAction) => {

                        const message = {
                            ...endpointAction.message,
                            payload: endpointAction.message.payload.length > 1500 ?
                                endpointAction.message.payload.substring(0, 1500) + '...' : endpointAction.message.payload ,
                        };

                        return {
                            ...accumulator,
                            [endpointAction.id]: {
                                ...endpointAction,
                                message,
                                preview: message.payload.length > 20 ? message.payload.substring(0, 20) + '...' : '',
                                datetime: toReadableDate(endpointAction.timestamp),
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
