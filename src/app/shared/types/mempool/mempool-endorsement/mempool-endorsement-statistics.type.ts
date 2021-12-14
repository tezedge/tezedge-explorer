import { MempoolEndorsementNodeStatistics } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-node-statistics.type';

export interface MempoolEndorsementStatistics {
  endorsementTypes: {
    name: string,
    color: string,
    value: number
  }[];
  previousBlockMissedEndorsements: number;
  nodeStatistics: MempoolEndorsementNodeStatistics[];
}
