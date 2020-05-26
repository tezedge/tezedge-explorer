const initialState: any = {
    connected: false,
    status: 'Disconnected',
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // TODO: refactor create action for succesfull websocket connect
        case 'incomingTransfer': {
            return {
                ...state,
                connected: true,
                status: 'connected',
            }
        }

        default:
            return state;
    }
}