const initialState: any = {
    connected: false,
    status: 'Disconnected',
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'METRICS_SUBSCRIBE': {
            return {
                ...state,
                connected: false,
                status: 'Reconnecting ',
            }
        }

        case 'METRICS_SUBSCRIBE_ERROR': {
            return {
                ...state,
                connected: false,
                status: 'Disconnected',
            }
        }

        // TODO: refactor create action for succesfull websocket connect
        case 'incomingTransfer': {
            return {
                ...state,
                connected: true,
                status: 'Connected',
            }
        }

        default:
            return state;
    }
}