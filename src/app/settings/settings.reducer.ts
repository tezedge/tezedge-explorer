const initialState: any = {
    endpoint: "",
}

export function reducer(state = initialState, action) {
    switch (action.type) {
       
        case 'SETTINGS_INIT_SUSCCESS': {
            return {
                endpoint: action.payload.endpoint,
            }
        }
       
        default:
            return state;
    }
}