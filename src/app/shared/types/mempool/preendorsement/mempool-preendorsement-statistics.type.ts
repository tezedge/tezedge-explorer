export interface MempoolPreEndorsementStatistics {
  endorsementTypes: {
    name: string,
    value: number
  }[];
  totalSlots: number;
  previousBlockMissedEndorsements: number;
}
