import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { MempoolBlockRound } from '@shared/types/mempool/common/mempool-block-round.type';
import { map } from 'rxjs/operators';
import { snakeCaseToCamelCase } from '@helpers/object.helper';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MempoolService {

  constructor(private http: HttpClient) { }

  getBlockRounds(http: string, level: number, round?: number): Observable<MempoolBlockRound[]> {
    const url = `${http}/dev/shell/automaton/stats/current_head/application?level=${level}` + (round ? `&round=${round}` : '');
    return this.http.get<MempoolBlockRound[]>(url).pipe(
      tap(MempoolService.handleError),
      map(snakeCaseToCamelCase),
      map(this.mapBlockRoundsResponse)
    );
  }

  private static handleError(res): any {
    if (res.error) {
      throw new Error(res.error);
    }
  }

  private mapBlockRoundsResponse(response: any[]): MempoolBlockRound[] {
    const result: MempoolBlockRound[] = [];
    response.forEach((detail: any) => {
      const detailResult: MempoolBlockRound = {
        blockTimestamp: detail.blockTimestamp,
        round: detail.round ?? 0,
        receiveTimestamp: detail.receiveTimestamp,
        blockHash: detail.blockHash,
        blockLevel: detail.blockLevel,
        baker: detail.baker,
        bakerPriority: detail.bakerPriority,
        value: detail,
        delta: {
          precheckStart: detail.precheckStart,
          precheckEnd: detail.precheckEnd - detail.precheckStart,

          downloadBlockHeaderStart: detail.downloadBlockHeaderStart,
          downloadBlockHeaderEnd: detail.downloadBlockHeaderEnd - detail.downloadBlockHeaderStart,

          downloadBlockOperationsStart: detail.downloadBlockOperationsStart - detail.downloadBlockHeaderEnd,
          downloadBlockOperationsEnd: detail.downloadBlockOperationsEnd ? (detail.downloadBlockOperationsEnd - detail.downloadBlockOperationsStart) : 0,

          loadDataStart: detail.loadDataStart - detail.downloadBlockOperationsEnd,
          loadDataEnd: detail.loadDataEnd - detail.loadDataStart,

          applyBlockStart: detail.applyBlockStart - detail.loadDataEnd,

          protocolTimes: !detail.protocolTimes ? null : {
            applyStart: detail.protocolTimes.applyStart - detail.applyBlockStart,

            operationsDecodingStart: detail.protocolTimes.operationsDecodingStart - detail.protocolTimes.applyStart,
            operationsDecodingEnd: detail.protocolTimes.operationsDecodingEnd - detail.protocolTimes.operationsDecodingStart,

            beginApplicationStart: detail.protocolTimes.beginApplicationStart - detail.protocolTimes.operationsDecodingEnd,
            beginApplicationEnd: detail.protocolTimes.beginApplicationEnd - detail.protocolTimes.beginApplicationStart,

            finalizeBlockStart: detail.protocolTimes.finalizeBlockStart - detail.protocolTimes.beginApplicationEnd,
            finalizeBlockEnd: detail.protocolTimes.finalizeBlockEnd - detail.protocolTimes.finalizeBlockStart,

            operationsMetadataEncodingStart: detail.protocolTimes.operationsMetadataEncodingStart - detail.protocolTimes.finalizeBlockEnd,
            operationsMetadataEncodingEnd: detail.protocolTimes.operationsMetadataEncodingEnd - detail.protocolTimes.operationsMetadataEncodingStart,

            collectNewRollsOwnerSnapshotsStart: detail.protocolTimes.collectNewRollsOwnerSnapshotsStart - detail.protocolTimes.operationsMetadataEncodingEnd,
            collectNewRollsOwnerSnapshotsEnd: detail.protocolTimes.collectNewRollsOwnerSnapshotsEnd - detail.protocolTimes.collectNewRollsOwnerSnapshotsStart,

            commitStart: detail.protocolTimes.commitStart - detail.protocolTimes.collectNewRollsOwnerSnapshotsEnd,
            commitEnd: detail.protocolTimes.commitEnd - detail.protocolTimes.commitStart,

            applyEnd: detail.protocolTimes.applyEnd - detail.protocolTimes.commitEnd
          },

          applyBlockEnd: detail.applyBlockEnd - (detail.protocolTimes?.applyEnd ?? null),

          storeResultStart: detail.storeResultStart - detail.applyBlockEnd,
          storeResultEnd: detail.storeResultEnd - detail.storeResultStart,

          sendStart: detail.sendStart - detail.precheckEnd,
          sendEnd: detail.sendEnd - detail.sendStart,
        }
      };
      result.push(detailResult);
    });

    return result;
  }
}
