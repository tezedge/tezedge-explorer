const initialState: any = {
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'SETTINGS_NODE_CHANGE': {
            return {
                state
            };
        }

        default:
            return state;
    }
}
