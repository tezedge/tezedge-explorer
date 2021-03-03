
import * as moment from 'moment-mini-ts';

const initialState: any = {
    eta: '',
    currentBlockCount: 0,
    downloadedBlocks: 0,
    downloadRate: 0,
    currentApplicationSpeed: 0,
    averageApplicationSpeed: 0,
    lastAppliedBlock: {
        level: 0
    },
    blockTimestamp: 0,
};

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'incomingTransfer': {
            return {
                ...state,
                eta: Math.floor(action.payload.eta / 60) + ' m ' + Math.floor(action.payload.eta % 60) + ' s',
                currentBlockCount: action.payload.currentBlockCount,
                downloadedBlocks: action.payload.downloadedBlocks,
                downloadRate: Math.floor(action.payload.downloadRate),
            };
        }

        case 'blockApplicationStatus': {
            return {
                ...state,
                currentApplicationSpeed: action.payload.currentApplicationSpeed,
                averageApplicationSpeed: action.payload.averageApplicationSpeed,
                lastAppliedBlock: action.payload.lastAppliedBlock ? action.payload.lastAppliedBlock : state.lastAppliedBlock,
                etaApplications:
                    Math.floor((state.currentBlockCount - state.lastAppliedBlock.level) / action.payload.currentApplicationSpeed) + ' m ',
            };
            // action.payload.currentApplicationSpeed
        }

        case 'MONITORING_LOAD':
        case 'MONITORING_LOAD_ERROR':
            return initialState;

        case 'NETWORK_STATS_LOAD_SUCCESS': {
            console.log(234);
            const etaApplicationMinutes =
                moment().diff(moment(action.payload.timestamp), 'minutes') / state.currentApplicationSpeed;

            return {
                ...state,
                blockTimestamp: action.payload.timestamp,
                currentBlockCount: action.payload.timestamp === state.blockTimestamp ? action.payload.level :
                    Math.floor(moment().diff(moment(action.payload.timestamp), 'minutes') /
                        // TODO: refactor and use constans
                        (moment(action.payload.timestamp).diff(moment(state.blockTimestamp), 'minutes') /
                            (action.payload.level - state.lastAppliedBlock.level)
                        )
                    ),
                currentApplicationSpeed: state.lastAppliedBlock.level === 0 ? 0 :
                    (action.payload.level - state.lastAppliedBlock.level) * 60,
                lastAppliedBlock: {
                    level: action.payload.level,
                },
                etaApplications: state.currentApplicationSpeed === 0 ? '0 m' :
                    Math.floor(etaApplicationMinutes / 60) + ' h ' +
                    Math.floor(etaApplicationMinutes % 60) + ' m ' ,
            };
        }

        default:
            return state;
    }
}
