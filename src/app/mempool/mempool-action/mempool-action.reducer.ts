
const initialState: any = {
    ids: [],
    entities: {},
    lastCursorId: 0,
    stream: false,
};

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'MEMPOOL_ACTION_LOAD': {
            return {
                ...state
            };
        }

        case 'MEMPOOL_ACTION_START_SUCCESS':
        case 'MEMPOOL_ACTION_LOAD_SUCCESS': {
            // console.log('[' + action.type + ']', action.payload);
            return {
                ...state,
                ids: [
                    ...action.payload.applied
                        .map(mempoolApplied => mempoolApplied.hash),
                    ...action.payload.refused
                        .map(mempoolRefused => mempoolRefused[0]),
                    ...action.payload.branch_refused
                        .map(mempoolBranchRefused => mempoolBranchRefused[0]),
                    ...action.payload.branch_delayed
                        .map(mempoolBranchDelayed => mempoolBranchDelayed[0]),
                    ...action.payload.unprocessed
                        .map(mempoolUnprocessed => mempoolUnprocessed[0]),
                ],
                entities: {
                    ...action.payload.applied
                        .reduce((accumulator, mempoolApplied) => {
                            return {
                                ...accumulator,
                                [mempoolApplied.hash]: {
                                    type: 'applied',
                                    ...mempoolApplied
                                }
                            };
                        }, {}),
                    ...action.payload.refused
                        .reduce((accumulator, mempoolRefused) => {
                            return {
                                ...accumulator,
                                [mempoolRefused[0]]: {
                                    type: 'refused',
                                    hash: mempoolRefused[0],
                                    ...mempoolRefused[1]
                                }
                            };
                        }, {}),
                    ...action.payload.branch_refused
                        .reduce((accumulator, mempoolBranchRefused) => {
                            return {
                                ...accumulator,
                                [mempoolBranchRefused[0]]: {
                                    type: 'branchRefused',
                                    hash: mempoolBranchRefused[0],
                                    ...mempoolBranchRefused[1]
                                }
                            };
                        }, {}),
                    ...action.payload.branch_delayed
                        .reduce((accumulator, mempoolBranchDelayed) => {
                            return {
                                ...accumulator,
                                [mempoolBranchDelayed[0]]: {
                                    type: 'branchDelayyed',
                                    hash: mempoolBranchDelayed[0],
                                    ...mempoolBranchDelayed[1]
                                }
                            };
                        }, {}),
                    ...action.payload.unprocessed
                        .reduce((accumulator, mempoolUnprocessed) => {
                            return {
                                ...accumulator,
                                [mempoolUnprocessed[0]]: {
                                    type: 'unprocessed',
                                    hash: mempoolUnprocessed[0],
                                    ...mempoolUnprocessed[1]
                                }
                            };
                        }, {}),
                },
                lastCursorId: getMempoolActionLength(state, action),
                stream: true,
            };
        }

        case 'MEMPOOL_ACTION_STOP': {
            return {
                ...state,
                stream: false
            };
        }

        default:
            return state;
    }
}

// get mempool items count
export function getMempoolActionLength(state, action) {

    return length = action.payload.applied.length +
        action.payload.refused.length +
        action.payload.branch_refused.length +
        action.payload.branch_delayed.length +
        action.payload.unprocessed.length;

}
