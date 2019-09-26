const initialState: any = {
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'incomingTransfer': {
            return {
                eta: Math.floor(action.payload.eta),
                currentBlockCount: action.payload.currentBlockCount,
                downloadedBlocks: action.payload.downloadedBlocks,
                downloadRate: Math.floor(action.payload.downloadRate),
            }
        }

        case 'METRICS_SUBSCRIBE_ERROR':
                return initialState
    
        default:
            return state;
    }
}