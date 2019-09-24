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
                        .map(peer => peer.identifier)
                ],
                entities: action.payload.reduce((accumulator, peer) => ({
                    ...accumulator,
                    [peer.identifier]: {
                        ...state.entities[peer.identifier],
                        ...peer
                    }
                }), {}),
                metrics: {
                    totalAvgSpeed:
                        (action.payload.reduce((accumulator, peer) =>
                            Math.floor(accumulator + peer.averageTransferSpeed), 0) / 1024).toFixed(3),
                    totalPeers: action.payload.length,
                }
            }
        }

        default:
            return state;
    }
}