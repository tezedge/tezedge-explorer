const initialState: any = {
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'NETWORK_ACTION_LOAD_SUCCESS': {
            console.log('[NETWORK_ACTION_LOAD_SUCCESS]', action);
            return {
                ...state,
                ...action
            }
        }

        default:
            return state;
    }
}