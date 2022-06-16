export interface BakingQuorum {
  threshold: number;
  total: number;
  notified: boolean;
  delegates: { [hash: string]: number };
}
