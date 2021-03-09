import { NetworkStatsLastAppliedBlock } from './network-stats-last-applied-block.type';

export class NetworkStats {
  eta: string;
  currentBlockCount: number;
  downloadedBlocks: number;
  downloadRate: number;
  lastAppliedBlock: NetworkStatsLastAppliedBlock;
  currentApplicationSpeed: number;
  averageApplicationSpeed: number;
  blockTimestamp: number;
  etaApplications: string;
}
