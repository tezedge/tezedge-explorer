import { NetworkPeers } from '../../shared/types/network/network-peers.type';

const initialState: NetworkPeers = {
  ids: [],
  entities: {},
  metrics: {
    totalAvgSpeed: 0,
  },
};

export function reducer(state: NetworkPeers = initialState, action): NetworkPeers {
  switch (action.type) {

    case 'WS_NETWORK_PEERS_LOAD_SUCCESS': {
      return {
        ids: [
          ...action.payload
            .filter(peer => peer.id !== null)
            .sort((a, b) => b.averageTransferSpeed - a.averageTransferSpeed)
            .map(peer => peer.id)
        ],
        entities: action.payload
          .filter(peer => peer.id !== null)
          .reduce((accumulator, peer) => ({
            ...accumulator,
            [peer.id]: {
              ...state.entities[peer.id],
              ...peer
            }
          })),
        metrics: {
          totalAvgSpeed: action.payload.reduce(
            (accumulator, peer) => Math.floor(accumulator + peer.currentTransferSpeed), 0
          ),
        }
      };
    }

    case 'MONITORING_LOAD':
    case 'MONITORING_LOAD_ERROR':
      return initialState;

    case 'NETWORK_PEERS_LOAD_SUCCESS': {
      return {
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
              ...state.entities[peer[0]],
              ...peer[1],
              ipAddress: peer[1].reachable_at.addr.substr(7),
              port: peer[1].reachable_at.port,
              transferredBytes: peer[1].stat.total_recv,
              // TODO: change to avegage
              averageTransferSpeed: peer[1].stat.current_outflow,
              currentTransferSpeed: (peer[1].stat.current_outflow + peer[1].stat.current_inflow),
            }
          }), {}),
        metrics: {
          totalAvgSpeed: action.payload.reduce((accumulator, peer) =>
            Math.floor(accumulator + peer[1].stat.total_recv), 0
          ),
        }
      };
    }

    default:
      return state;
  }
}
