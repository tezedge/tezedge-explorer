export interface MempoolOperation {
  status: string;
  type: string;
  hash: string;
  branch: string;
  contents: any;
  error: string;
  protocol: string;
  signature: string;
}
