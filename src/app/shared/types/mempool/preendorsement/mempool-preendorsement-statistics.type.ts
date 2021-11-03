export interface MempoolPreEndorsementStatistics {
  endorsementTypes: {
    name: string,
    value: number
  }[];
  totalSlots: number;
  quorum: number;
  quorumTime: number;
  previousBlockMissedEndorsements: number;
  previousBlockQuorumTime: number;
  indexOfEndorsementWhichCrossedThreshold: number;
}
