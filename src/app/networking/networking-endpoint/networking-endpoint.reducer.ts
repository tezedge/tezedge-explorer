const initialState: any = {
    connected: false,
    status: 'disconnected',
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'METRICS_SUBSCRIBE_ERROR': {
            return {
                ...state,
                connected: false,
                status: 'disconnected',
            }
        }

        default:
            return state;
    }
}