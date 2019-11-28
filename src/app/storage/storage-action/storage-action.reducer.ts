const initialState: any = {
    ids: [],
}

export function reducer(state = initialState, action) {
    switch (action.type) {
       
        case 'STORAGE_BLOCK_ACTION_LOAD': {
            return {
                ...state,
            }
        }

        case 'STORAGE_BLOCK_LOAD_ACTION_SUCCESS': {
            return {
                ...state,
                ids: action.payload,
            }
        }

        default:
            return state;
    }
}