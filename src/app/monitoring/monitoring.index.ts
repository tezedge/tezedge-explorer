import { NetworkHistory } from '@shared/types/network/network-history.type';
import { NetworkPeers } from '@shared/types/network/network-peers.type';
import { NetworkStats } from '@shared/types/network/network-stats.type';
import { State } from '@app/app.index';

export interface MonitoringState {
  networkHistory: NetworkHistory;
  networkPeers: NetworkPeers;
  networkStats: NetworkStats;
}

export const selectNetworkHistory = (state: State): NetworkHistory => state.monitoring.networkHistory;
