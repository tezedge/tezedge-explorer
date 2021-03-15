export class NetworkActionEntity {
  id: number;
  timestamp: number;
  remote_addr: string;
  incoming: boolean;
  source_type: string;
  original_bytes: number[];
  decrypted_bytes: number[];
  error: [];
  message: any[];
  originalId: number;
  ordinal_id: number;
  hexValues: string[];
  category: string;
  kind: string;
  payload: any;
  preview: string;
  datetime: string;
}
