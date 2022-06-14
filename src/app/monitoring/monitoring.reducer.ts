import {
  MONITORING_LOAD,
  MONITORING_OCTEZ_PEERS_LOAD_SUCCESS,
  MONITORING_OCTEZ_STATS_LOAD_SUCCESS,
  MONITORING_WEBSOCKET_HISTORY_LOAD_SUCCESS,
  MonitoringActions
} from './monitoring.actions';
import { MonitoringState } from '@monitoring/monitoring.index';
import { NetworkHistory } from '@shared/types/network/network-history.type';
import { NetworkPeers } from '@shared/types/network/network-peers.type';
import { NetworkStats } from '@shared/types/network/network-stats.type';
import * as moment from 'moment-mini-ts';

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

export function reducer(state: MonitoringState = initialState, action: MonitoringActions): MonitoringState {
  switch (action.type) {

    case MONITORING_WEBSOCKET_HISTORY_LOAD_SUCCESS: {
      return {
        ...state,
        networkHistory: getWebsocketNetworkHistory(state, action.payload.history),
        networkPeers: getWebsocketNetworkPeers(state, action.payload.peers),
        networkStats: getWebsocketNetworkStats(state, action.payload.stats)
      };
    }

    case MONITORING_OCTEZ_PEERS_LOAD_SUCCESS: {
      return {
        ...state,
        networkPeers: {
          ids: [
            ...action.payload
              // use only active peers
              .filter(peer => peer[1].state === 'running')
              // sort rows according to average speed
              .sort((a, b) => b[1].stat.current_outflow - a[1].stat.current_outflow)
              .map(peer => peer[0])
          ],
          entities: action.payload
            .filter(peer => peer[1].state === 'running')
            .reduce((accumulator, peer) => ({
              ...accumulator,
              [peer[0]]: {
                ...state.networkPeers.entities[peer[0]],
                ...peer[1],
                ipAddress: peer[1].reachable_at.addr.substr(7),
                port: peer[1].reachable_at.port,
                transferredBytes: peer[1].stat.total_recv,
                // TODO: change to average
                averageTransferSpeed: peer[1].stat.current_outflow,
                currentTransferSpeed: (peer[1].stat.current_outflow + peer[1].stat.current_inflow),
              }
            }), {}),
          metrics: {
            totalAvgSpeed: action.payload.reduce((accumulator, peer) =>
              Math.floor(accumulator + peer[1].stat.total_recv), 0
            ),
          }
        }
      };
    }

    case MONITORING_OCTEZ_STATS_LOAD_SUCCESS: {
      const etaApplicationSeconds =
        moment().diff(moment(action.payload.timestamp), 'seconds') / state.networkStats.currentApplicationSpeed;

      return {
        ...state,
        networkStats: {
          ...state.networkStats,
          blockTimestamp: action.payload.timestamp,
          currentBlockCount: action.payload.timestamp === state.networkStats.blockTimestamp ? action.payload.level :
            Math.floor(moment().diff(moment(action.payload.timestamp), 'minutes') /
              // TODO: refactor and use constants
              (moment(action.payload.timestamp).diff(moment(state.networkStats.blockTimestamp === 0 ? action.payload.timestamp : state.networkStats.blockTimestamp), 'minutes') /
                (action.payload.level - state.networkStats.lastAppliedBlock.level)
              )
            ),
          currentApplicationSpeed: state.networkStats.lastAppliedBlock.level === 0 ? 0 :
            (action.payload.level - state.networkStats.lastAppliedBlock.level) * 60,
          lastAppliedBlock: {
            level: action.payload.level,
          },
          etaApplications: etaApplicationSeconds !== 0 ? getETA(etaApplicationSeconds) : 'Infinity'
        }
      };
    }

    case MONITORING_LOAD:
      return initialState;

    default:
      return state;
  }
}

function getWebsocketNetworkHistory(state: MonitoringState, history: any): NetworkHistory {
  return {
    ids: [...history.chain.map(cycle => cycle.id)],
    entities: history.chain.reduce((accumulator, cycle) => ({
      ...accumulator,
      [cycle.id]: {
        ...state.networkHistory.entities[cycle.id],
        ...cycle
      }
    }), {}),
    downloadDurationSeries: history.blocks
      .filter(cycle => cycle.downloadDuration)
      .map(cycle => ({
        name: cycle.group,
        value: Math.floor(4096 / cycle.downloadDuration)
      }))
  };
}

function getWebsocketNetworkPeers(state: MonitoringState, peers: any): NetworkPeers {
  return {
    ids: [
      ...peers
        .filter(peer => peer.id !== null)
        .sort((a, b) => b.averageTransferSpeed - a.averageTransferSpeed)
        .map(peer => peer.id)
    ],
    entities: peers
      .filter(peer => peer.id !== null)
      .reduce((accumulator, peer) => ({
        ...accumulator,
        [peer.id]: {
          ...state.networkPeers.entities[peer.id],
          ...peer
        }
      }), {}),
    metrics: {
      totalAvgSpeed: peers.reduce(
        (accumulator, peer) => Math.floor(accumulator + peer.currentTransferSpeed), 0
      ),
    }
  };
}

function getWebsocketNetworkStats(state: MonitoringState, stats: any): NetworkStats {
  const lastAppliedBlockInState = state.networkStats.lastAppliedBlock;
  const newBlockValues: boolean = stats.lastAppliedBlock
    && (stats.lastAppliedBlock.level !== lastAppliedBlockInState.level || stats.lastAppliedBlock.hash !== lastAppliedBlockInState.hash);
  const lastAppliedBlock = newBlockValues ? stats.lastAppliedBlock : lastAppliedBlockInState;

  return {
    ...state.networkStats,
    eta: getETA(stats.eta),
    currentBlockCount: stats.currentBlockCount,
    downloadedBlocks: stats.downloadedBlocks,
    downloadRate: Math.floor(stats.downloadRate),
    currentApplicationSpeed: stats.currentApplicationSpeed,
    averageApplicationSpeed: stats.averageApplicationSpeed,
    lastAppliedBlock,
    etaApplications: stats.currentApplicationSpeed !== 0
      ? getETA((state.networkStats.currentBlockCount - lastAppliedBlockInState.level) / stats.currentApplicationSpeed * 60)
      : 'Infinity'
  };
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
