const initialState: any = {
    ids: [],
    entities: {},
    downloadDurationSeries: []
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'chainStatus': {
            return {
                ...state,
                ids: [
                    ...action.payload.chain.map(cycle => cycle.id)
                ],
                entities: action.payload.chain.reduce((accumulator, cycle) => ({
                    ...accumulator,
                    [cycle.id]: {
                        ...state.entities[cycle.id],
                        ...cycle
                    }
                }), {}),
                // downloadDurationSeries: action.payload.chain
                //     .filter(cycle => cycle.duration)
                //     .map((cycle) => ({
                //         name: cycle.id,
                //         value: Math.floor(action.payload.blocksPerCycle/cycle.duration)
                //     }), {})
            }
        }

        case 'blockStatus': {
             return {
                ...state,
                downloadDurationSeries: action.payload
                    .filter(cycle => cycle.downloadDuration)
                    .map((cycle) => ({
                        name: cycle.group,
                        value: Math.floor(4096/cycle.downloadDuration)
                    }), {})
             }
        }

        case 'MONITORING_LOAD':
            return initialState

        default:
            return state;
    }

}