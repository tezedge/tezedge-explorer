export interface EmbeddedQuorum {
  threshold: number;
  total: number;
  notified: boolean;
  delegates: { [hash: string]: number };
}
