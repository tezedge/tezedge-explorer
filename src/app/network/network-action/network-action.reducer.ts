import * as moment from 'moment-mini-ts';

const initialState: any = {
    ids : [],
    entities: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'NETWORK_ACTION_LOAD_SUCCESS': {
            console.log('[NETWORK_ACTION_LOAD_SUCCESS]', action);
            
            return {
                ...state,
                ids: [
                    ...action.payload
                        .map(networkAction => networkAction.id)
                ],
                entities: action.payload
                    .reduce((accumulator, networkAction) => ({
                        ...accumulator,
                        [networkAction.id]: {
                            ...state.entities[networkAction.id],
                            ...networkAction,
                            datetime: moment(networkAction.timestamp).format('HH:mm:ss,  DD MMM YYYY'),
                        }
                    }), {}),
            }
        }

        default:
            return state;
    }
}