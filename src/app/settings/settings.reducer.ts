const initialState: any = {
    endpoint: "",
}

export function reducer(state = initialState, action) {
    switch (action.type) {
       
        // TODO: refactor and move to settings-endpoint
        case 'SETTINGS_INIT_SUSCCESS': {
            return {
                endpoint: action.payload.endpoint,
            }
        }

        case 'SETTINGS_ENDPOINT_SAVE': {
            return {
                endpoint: action.payload.endpoint,
            }
        }

        default:
            return state;
    }
}