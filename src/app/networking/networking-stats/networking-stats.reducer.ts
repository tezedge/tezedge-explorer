const initialState: any = {
    eta: '',
    currentBlockCount: 0,
    downloadedBlocks: 0,
    downloadRate: 0,
    currentApplicationSpeed: 0,
    averageApplicationSpeed: 0,
    lastAppliedBlock: {
        level: 0
    }
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'incomingTransfer': {
            return {
                ...state,
                eta: Math.floor(action.payload.eta / 60) + " m " + Math.floor(action.payload.eta % 60) + " s",
                currentBlockCount: action.payload.currentBlockCount,
                downloadedBlocks: action.payload.downloadedBlocks,
                downloadRate: Math.floor(action.payload.downloadRate),
            }
        }

        case 'blockApplicationStatus': {
            return {
                ...state,
                currentApplicationSpeed: action.payload.currentApplicationSpeed,
                averageApplicationSpeed: action.payload.averageApplicationSpeed,
                lastAppliedBlock: action.payload.lastAppliedBlock ? action.payload.lastAppliedBlock : state.lastAppliedBlock,
                etaApplications: Math.floor((state.currentBlockCount - state.lastAppliedBlock.level) / action.payload.currentApplicationSpeed) + " m ",
            }
            // action.payload.currentApplicationSpeed 
        }

        case 'METRICS_SUBSCRIBE_ERROR':
            return initialState

        default:
            return state;
    }
}