
export interface MempoolEndorsementStatistics {
  endorsementTypes: {
    name: string,
    value: number
  }[];
  totalSlots: number;
  previousBlockMissedEndorsements: number;
  quorum: number;
}
