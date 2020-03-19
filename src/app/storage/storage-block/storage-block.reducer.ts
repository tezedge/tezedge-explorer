import * as moment from 'moment-mini-ts';

const initialState: any = {
    ids: [],
    entities: {}
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'STORAGE_BLOCK_LOAD': {
            return {
                ...state,
            }
        }

        case 'STORAGE_BLOCK_LOAD_SUCCESS': {
            return {
                ...state,
                ids: [
                    ...action.payload
                        .map(block => block.hash)
                ],
                entities: action.payload
                    .reduce((accumulator, block) => ({
                        ...accumulator,
                        [block.hash]: {
                            ...state.entities[block.hash],
                            ...block,
                            datetime: moment(block.header.timestamp).format('HH:mm:ss,  DD MMM YYYY'),

                        }
                    }), {}),
            }
        }

        default:
            return state;
    }
}