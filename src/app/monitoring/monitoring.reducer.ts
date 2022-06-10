import { MONITORING_LOAD, MonitoringActions } from './monitoring.actions';
import { MonitoringState } from '@monitoring/monitoring.index';
import { NetworkHistory } from '@shared/types/network/network-history.type';
import { NetworkPeers } from '@shared/types/network/network-peers.type';
import { NetworkStats } from '@shared/types/network/network-stats.type';

const initialNetworkHistoryState: NetworkHistory = {
  ids: [],
  entities: {},
  downloadDurationSeries: []
};

const initialNetworkPeersState: NetworkPeers = {
  ids: [],
  entities: {},
  metrics: {
    totalAvgSpeed: 0,
  },
};

const initialNetworkStatsState: NetworkStats = {
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

const initialState: MonitoringState = {
  networkHistory: initialNetworkHistoryState,
  networkPeers: initialNetworkPeersState,
  networkStats: initialNetworkStatsState,
};

export function reducer(state: MonitoringState = initialState, action: MonitoringActions | any): MonitoringState {
  switch (action.type) {

    case 'WS_NETWORK_HISTORY_LOAD_SUCCESS': {
      return {
        ...state,
        networkHistory: {
          ids: [...action.payload.chain.map(cycle => cycle.id)],
          entities: action.payload.chain.reduce((accumulator, cycle) => ({
            ...accumulator,
            [cycle.id]: {
              ...state.networkHistory.entities[cycle.id],
              ...cycle
            }
          }), {}),
          downloadDurationSeries: action.payload.blocks
            .filter(cycle => cycle.downloadDuration)
            .map(cycle => ({
              name: cycle.group,
              value: Math.floor(4096 / cycle.downloadDuration)
            }))
        }
      };
    }

    case MONITORING_LOAD:
      return initialState;

    default:
      return state;
  }
}
