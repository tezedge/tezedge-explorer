import { NetworkHistory } from '@shared/types/network/network-history.type';
import { NetworkPeers } from '@shared/types/network/network-peers.type';
import { NetworkStats } from '@shared/types/network/network-stats.type';
import { State } from '@app/app.index';
import { NetworkStatsLastAppliedBlock } from '@shared/types/network/network-stats-last-applied-block.type';

export interface MonitoringState {
  networkHistory: NetworkHistory;
  networkPeers: NetworkPeers;
  networkStats: NetworkStats;
}

export const selectNetworkHistory = (state: State): NetworkHistory => state.monitoring.networkHistory;
export const selectNetworkPeers = (state: State): NetworkPeers => state.monitoring.networkPeers;
export const selectNetworkStats = (state: State): NetworkStats => state.monitoring.networkStats;
export const selectNetworkLastAppliedBlockLevel = (state: State): number => state.monitoring.networkStats.lastAppliedBlock.level;
export const selectNetworkCurrentBlockHash = (state: State): string | undefined => state.monitoring.networkStats.lastAppliedBlock.hash;
export const selectNetworkCurrentBlock = (state: State): NetworkStatsLastAppliedBlock => state.monitoring.networkStats.lastAppliedBlock;
