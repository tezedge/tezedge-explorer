export interface MempoolEndorsementStatistics {
  endorsementTypes: {
    name: string,
    color: string,
    value: number
  }[];
  previousBlockMissedEndorsements: number;
}
