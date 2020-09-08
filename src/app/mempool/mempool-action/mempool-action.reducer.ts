import * as moment from 'moment-mini-ts';

const initialState: any = {
    ids: [],
    entities: {},
    stream: false,
};

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'MEMPOOL_ACTION_LOAD': {
            return {
                ...state,
            };
        }

        case 'MEMPOOL_ACTION_START_SUCCESS':
        case 'MEMPOOL_ACTION_LOAD_SUCCESS': {
            console.log('[' + action.type + ']', action.payload[0]);
            return {
                ...state,
                ids: [],
                // action.payload.length === 0 ? [] : action.payload
                //     .map(mempoolAction => mempoolAction.id)
                //     .sort((a, b) => a - b),
                entities: action.payload,
                // action.payload.length === 0 ? {} : action.payload
                //     .reduce((accumulator, mempoolAction) => {
                //         return {
                //             ...mempoolAction,
                //         };
                //     }, {}),
                stream: true,
            };
        }

        case 'MEMPOOL_ACTION_STOP': {
            return {
                ...state,
                stream: false
            };
        }

        default:
            return state;
    }
}
