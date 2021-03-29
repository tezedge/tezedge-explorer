export class NetworkActionEntity {
  id: number;
  timestamp: number;
  remote_addr: string;
  incoming: boolean;
  source_type: string;
  error: [];
  originalId: number;
  category: string;
  kind: string;
  payload: any;
  datetime: string;
}
