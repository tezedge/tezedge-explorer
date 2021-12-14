import * as moment from 'moment-mini-ts';
import { NetworkStats } from '@shared/types/network/network-stats.type';
import { State } from '@app/app.reducers';

const initialState: NetworkStats = {
  eta: '',
  currentBlockCount: 0,
  downloadedBlocks: 0,
  downloadRate: 0,
  currentApplicationSpeed: 0,
  averageApplicationSpeed: 0,
  lastAppliedBlock: {
    level: 0,
  },
  blockTimestamp: 0,
  etaApplications: undefined
};

export function reducer(state: NetworkStats = initialState, action): NetworkStats {
  switch (action.type) {
    case 'WS_NETWORK_STATS_LOAD': {
      return {
        ...state,
        eta: getETA(action.payload.eta),
        currentBlockCount: action.payload.currentBlockCount,
        downloadedBlocks: action.payload.downloadedBlocks,
        downloadRate: Math.floor(action.payload.downloadRate),
        currentApplicationSpeed: action.payload.currentApplicationSpeed,
        averageApplicationSpeed: action.payload.averageApplicationSpeed,
        lastAppliedBlock: action.payload.lastAppliedBlock ?? state.lastAppliedBlock,
        etaApplications: action.payload.currentApplicationSpeed !== 0
          ? getETA((state.currentBlockCount - state.lastAppliedBlock.level) / action.payload.currentApplicationSpeed * 60)
          : 'Infinity'
      };
    }

    case 'MONITORING_LOAD':
    case 'MONITORING_LOAD_ERROR':
      return initialState;

    case 'NETWORK_STATS_LOAD_SUCCESS': {
      const etaApplicationSeconds =
        moment().diff(moment(action.payload.timestamp), 'seconds') / state.currentApplicationSpeed;

      return {
        ...state,
        blockTimestamp: action.payload.timestamp,
        currentBlockCount: action.payload.timestamp === state.blockTimestamp ? action.payload.level :
          Math.floor(moment().diff(moment(action.payload.timestamp), 'minutes') /
            // TODO: refactor and use constants
            (moment(action.payload.timestamp).diff(moment(state.blockTimestamp === 0 ? action.payload.timestamp : state.blockTimestamp), 'minutes') /
              (action.payload.level - state.lastAppliedBlock.level)
            )
          ),
        currentApplicationSpeed: state.lastAppliedBlock.level === 0 ? 0 :
          (action.payload.level - state.lastAppliedBlock.level) * 60,
        lastAppliedBlock: {
          level: action.payload.level,
        },
        etaApplications: etaApplicationSeconds !== 0 ? getETA(etaApplicationSeconds) : 'Infinity'
      };
    }

    default:
      return state;
  }
}

function getETA(eta: number): string {
  const days = Math.floor(eta / 86400);
  const hours = Math.floor((eta / 3600) % 24);
  const minutes = Math.floor((eta / 60) % 60);
  const seconds = Math.floor(eta % 60);

  return numberOrSpace(days, 'd ')
    + numberOrSpace(hours, 'h ', days > 0)
    + numberOrSpace(minutes, 'm ', days > 0 || hours > 0)
    + numberOrSpace(seconds, 's', days > 0 || hours > 0 || minutes > 0);
}

function numberOrSpace(value: number, mu: string, canBeZero?: boolean): string {
  return (value >= 1 && value !== Infinity) || (value < 1 && canBeZero)
    ? (value > 9 ? value + mu : `0${value}${mu}`)
    : '';
}

export const selectNetworkCurrentBlock = (state: State) => state.networkStats.lastAppliedBlock.level;
