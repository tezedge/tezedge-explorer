const initialState: any = {
    ids: [],
    entities: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // TODO: refactor actions name
        case 'peersMetrics': {
            return {
                ids: [
                    ...action.payload.map(peer => peer.identifier)
                ],
                entities: action.payload.reduce((accumulator, peer) => ({
                    ...accumulator,
                    [peer.identifier]: {
                        ...state.entities[peer.identifier],
                        ...peer
                    }
                }), {}),
            }
        }

        default:
            return state;
    }
}