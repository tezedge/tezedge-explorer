export interface StorageRequest {
  reqId: {
    locator: number;
    counter: number;
  };
  pendingSince: string;
  pendingFor: number;
  kind: string;
  requestor: string;
  status?: 'Success' | 'Error';
}
