const initialState: any = {
};

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'SANDBOX_NODE_START': {
            return {
                ...state
            }
        }

        default:
            return state;
    }
}
