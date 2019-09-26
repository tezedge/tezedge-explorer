const initialState: any = {
    ids: [],
    entities: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'blockStatus': {
            return {

                ids: [
                    ...action.payload.map(cycle => cycle.group)
                ],
                entities: action.payload.reduce((accumulator, cycle) => ({
                    ...accumulator,
                    [cycle.group]: {
                        ...state.entities[cycle.group],
                        ...cycle
                    }
                }), {}),
            }
        }

        case 'METRICS_SUBSCRIBE_ERROR':
            return initialState

        default:
            return state;
    }

}