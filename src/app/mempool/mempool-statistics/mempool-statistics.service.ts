import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MempoolStatisticsOperation } from '@shared/types/mempool/statistics/mempool-statistics-operation.type';
import * as moment from 'moment-mini-ts';
import { MempoolStatisticsOperationNode } from '@shared/types/mempool/statistics/mempool-statistics-operation-node.type';

@Injectable({
  providedIn: 'root'
})
export class MempoolStatisticsService {

  constructor(private http: HttpClient) { }

  getOperationNodeStats(api: string): Observable<MempoolStatisticsOperation[]> {
    api = 'http://debug.dev.tezedge.com:18732';
    const url = `${api}/dev/shell/automaton/mempool/operation_stats`;
    return this.http.get<MempoolStatisticsOperation[]>(url).pipe(
    // return this.http.get<MempoolStatisticsOperation[]>('assets/json/mempool-statistics.json').pipe(
      map(this.mapOperationNodeStatsResponse)
    );
  }

  private mapOperationNodeStatsResponse(response: any): MempoolStatisticsOperation[] {
    return Object.keys(response).map(opKey => {

      const nodes: MempoolStatisticsOperationNode[] = Object.keys(response[opKey].nodes).map(key => {
        const received: number[] = response[opKey].nodes[key].received.map(r => r.latency).filter(Boolean);
        const sent: number[] = response[opKey].nodes[key].sent.map(s => s.latency).filter(Boolean);
        return {
          id: key,
          received,
          sent,
          maxReceived: received[0] ? Math.max(...received) : undefined,
          maxSent: sent[0] ? Math.max(...sent) : undefined,
        };
      });

      const maxReceivedValues = nodes.map(n => n.maxReceived).filter(Boolean);
      const maxSentValues = nodes.map(n => n.maxSent).filter(Boolean);
      return {
        hash: opKey,
        nodes,
        nodesLength: nodes.length,
        maxReceived: maxReceivedValues[0] ? Math.max(...maxReceivedValues) : undefined,
        maxSent: maxSentValues[0] ? Math.max(...maxSentValues) : undefined,
        dateTime: response[opKey].min_time
      };
    });
  }
}
