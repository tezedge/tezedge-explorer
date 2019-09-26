const initialState: any = {
    connected: false,
    status: '',
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'METRICS_SUBSCRIBE_ERROR': {
            return {
                connected: false,
                status: action.payload,
            }
        }

        default:
            return state;
    }
}