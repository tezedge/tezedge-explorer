import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MempoolOperationService {

  constructor(private http: HttpClient) { }

  getOperations(api: string): Observable<MempoolPendingOperations> {
    return this.http.get<MempoolPendingOperations>(api + '/chains/main/mempool/pending_operations');
  }
}

export interface MempoolPendingOperations {
  applied: {
    branch: string;
    contents: {
      block_payload_hash: string;
      kind: string;
      level: number;
      round: number;
      slot: number;
      amount: string;
      counter: string;
      destination: string;
      fee: string;
      gas_limit: string;
      source: string;
      storage_limit: string;
      parameters: {
        entrypoint: string;
        value: any;
      };
    }[];
    hash: string;
    signature: string;
  }[];
  branch_delayed: any[];
  branch_refused: any[][];
  outdated: any[][];
  refused: any[];
  unprocessed: any[];
}
