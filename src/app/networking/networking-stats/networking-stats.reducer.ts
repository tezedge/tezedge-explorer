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

        default:
            return state;
    }
}