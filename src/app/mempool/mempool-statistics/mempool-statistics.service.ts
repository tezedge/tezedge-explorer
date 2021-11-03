import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MempoolStatisticsOperation } from '@shared/types/mempool/statistics/mempool-statistics-operation.type';
import { MempoolStatisticsOperationNode } from '@shared/types/mempool/statistics/mempool-statistics-operation-node.type';

@Injectable({
  providedIn: 'root'
})
export class MempoolStatisticsService {

  constructor(private http: HttpClient) { }

  getOperationNodeStats(api: string): Observable<MempoolStatisticsOperation[]> {
    const url = `${api}/dev/shell/automaton/mempool/operation_stats`;
    return this.http.get<MempoolStatisticsOperation[]>(url).pipe(
      // return this.http.get<MempoolStatisticsOperation[]>('assets/json/mempool-statistics.json').pipe(
      map(this.mapOperationNodeStatsResponse)
    );
  }

  private mapOperationNodeStatsResponse(response: any): MempoolStatisticsOperation[] {
    return Object.keys(response).slice(0,10).map(opKey => {

      const nodes: MempoolStatisticsOperationNode[] = Object.keys(response[opKey].nodes).map(key => {
        return {
          ...response[opKey].nodes[key],
          id: key
        };
      });

      const receivedValues = nodes.map(n => n.received[0]).filter(l => l !== undefined).map(r => r.latency);
      const sentValues = nodes.map(n => n.sent[0]).filter(l => l !== undefined).map(r => r.latency);
      const contentReceivedValues = nodes.map(n => n.content_received[0]).filter(l => l !== undefined);

      const firstReceived = receivedValues.length ? Math.min(...receivedValues) : undefined;
      const firstSent = sentValues.length ? Math.min(...sentValues) : undefined;
      const contentReceived = contentReceivedValues.length ? Math.min(...contentReceivedValues) : undefined;
      const validationStarted = response[opKey].validation_started ?? undefined;
      const validationResult = response[opKey].validation_result ? response[opKey].validation_result[0] : undefined;

      const delta = firstSent - firstReceived;
      const contentReceivedDelta = contentReceived - firstReceived;
      const validationStartedDelta = validationStarted - contentReceived;
      const validationResultDelta = validationResult - validationStarted;
      const firstSentDelta = firstSent - validationResult;

      return {
        ...response[opKey],
        hash: opKey,
        nodes,
        nodesLength: nodes.length,
        firstReceived,
        firstSent,
        validationStarted,
        validationResult,
        contentReceived: contentReceived ? contentReceived : undefined,
        delta: isNaN(delta) ? undefined : delta,
        contentReceivedDelta: isNaN(contentReceivedDelta) ? undefined : contentReceivedDelta,
        validationStartedDelta: isNaN(validationStartedDelta) ? undefined : validationStartedDelta,
        validationResultDelta: isNaN(validationResultDelta) ? undefined : validationResultDelta,
        firstSentDelta: isNaN(firstSentDelta) ? undefined : firstSentDelta,
        kind: response[opKey].kind,
        dateTime: response[opKey].min_time.toString()
      };
    });
  }
}
