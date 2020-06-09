import * as moment from 'moment-mini-ts';

const initialState: any = {
    ids: [],
    entities: {},
    stream: false,
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'STORAGE_BLOCK_LOAD': {
            return {
                ...state,
                stream: true,
            };
        }

        case 'STORAGE_BLOCK_START_SUCCESS':
        case 'STORAGE_BLOCK_LOAD_SUCCESS': {
            return {
                ...state,
                ids: [
                    ...action.payload
                        .map(block => block.hash)
                        .reverse()
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
                    stream: true,
            };
        }

        case 'STORAGE_BLOCK_STOP': {
            return {
                ...state,
                stream: false,
            };
        }

        default:
            return state;
    }
}
