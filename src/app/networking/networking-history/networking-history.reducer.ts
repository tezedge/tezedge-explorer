const initialState: any = {
    ids: [],
    entities: {},
    downloadDurationSeries: []
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
                downloadDurationSeries: action.payload
                    .filter(cycle => cycle.downloadDuration)
                    .map((cycle) => ({
                        name: cycle.group,
                        value: Math.floor(4096/cycle.downloadDuration)
                    }), {})
            }
        }

        case 'METRICS_SUBSCRIBE_ERROR':
            return initialState

        default:
            return state;
    }

}