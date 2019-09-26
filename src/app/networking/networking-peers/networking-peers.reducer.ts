const initialState: any = {
    ids: [],
    entities: {},
    metrics: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // TODO: refactor actions name
        case 'peersMetrics': {
            return {
                ids: [
                    ...action.payload
                        // sort rows according to average speed   
                        .slice().sort((a, b) => b.averageTransferSpeed - a.averageTransferSpeed)
                        .map(peer => peer.id)
                ],
                entities: action.payload.reduce((accumulator, peer) => ({
                    ...accumulator,
                    [peer.id]: {
                        ...state.entities[peer.id],
                        ...peer
                    }
                }), {}),
                metrics: {
                    totalAvgSpeed:
                        (action.payload.reduce((accumulator, peer) =>
                            Math.floor(accumulator + peer.currentTransferSpeed), 0) / 1024).toFixed(3),
                    totalPeers: action.payload.length,
                }
            }
        }

        case 'METRICS_SUBSCRIBE_ERROR':
                return initialState
    
        default:
            return state;
    }
}