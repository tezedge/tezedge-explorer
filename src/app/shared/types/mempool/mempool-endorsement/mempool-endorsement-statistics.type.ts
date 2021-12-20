
export interface MempoolEndorsementStatistics {
  endorsementTypes: {
    name: string,
    value: number
  }[];
  previousBlockMissedEndorsements: number;
}
