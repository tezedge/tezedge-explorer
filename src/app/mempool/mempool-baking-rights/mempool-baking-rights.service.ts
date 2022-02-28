import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { snakeCaseToCamelCase } from '@helpers/object.helper';
import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';
import { MempoolBlockDetails } from '@shared/types/mempool/common/mempool-block-details.type';

@Injectable({
  providedIn: 'root'
})
export class MempoolBakingRightsService {

  constructor(private http: HttpClient) { }

  getBakingRights(http: string, level: number): Observable<MempoolBakingRight[]> {
    const url = `${http}/dev/shell/automaton/stats/current_head/peers?level=${level}`;
    return this.http.get<MempoolBakingRight[]>(url).pipe(
      tap(this.handleError),
      map(snakeCaseToCamelCase),
      map(this.mapBakingRights)
    );
  }

  getBakingRightDetails(http: string, level: number): Observable<[]> {
    const url = `${http}/dev/shell/automaton/stats/current_head/application?level=${level}`;
    return this.http.get<MempoolBlockDetails[]>(url).pipe(
      tap(this.handleError),
      map(snakeCaseToCamelCase),
      map(this.mapBakingRightsDetails)
    );
  }

  private handleError(res): any {
    if (res.error) {
      throw new Error(res.error);
    }
  }

  private mapBakingRights(response: any[]): MempoolBakingRight[] {
    return response.map(right => ({
      ...right,
      getOperationsRecvStartTime: (right.getOperationsRecvStartTime && right.sentTime) ? right.getOperationsRecvStartTime - right.sentTime : undefined,
      getOperationsRecvEndTime: (right.getOperationsRecvEndTime && right.getOperationsRecvStartTime) ? right.getOperationsRecvEndTime - right.getOperationsRecvStartTime : undefined,
      operationsSendStartTime: (right.operationsSendStartTime && right.getOperationsRecvStartTime) ? right.operationsSendStartTime - right.getOperationsRecvStartTime : undefined,
      operationsSendEndTime: (right.operationsSendEndTime && right.operationsSendStartTime) ? right.operationsSendEndTime - right.operationsSendStartTime : undefined,
      responseRate: (right.operationsSendNum ?? 0) + '/' + (right.getOperationsRecvNum ?? 0),
    }));
  }

  private mapBakingRightsDetails(response: any[]): any {
    const result: MempoolBlockDetails[] = [];
    response.forEach((dr: any) => {
      const detailResult: MempoolBlockDetails = {
        blockTimestamp: dr.blockTimestamp,
        receiveTimestamp: dr.receiveTimestamp,
        blockHash: dr.blockHash,
        baker: dr.baker,
        bakerPriority: dr.bakerPriority,
        value: dr,
        delta: {
          precheckStart: dr.precheckStart,
          precheckEnd: dr.precheckEnd - dr.precheckStart,

          downloadBlockHeaderStart: dr.downloadBlockHeaderStart,
          downloadBlockHeaderEnd: dr.downloadBlockHeaderEnd - dr.downloadBlockHeaderStart,

          downloadBlockOperationsStart: dr.downloadBlockOperationsStart - dr.downloadBlockHeaderEnd,
          downloadBlockOperationsEnd: dr.downloadBlockOperationsEnd - dr.downloadBlockOperationsStart,

          loadDataStart: dr.loadDataStart - dr.downloadBlockOperationsEnd,
          loadDataEnd: dr.loadDataEnd - dr.loadDataStart,

          applyBlockStart: dr.applyBlockStart - dr.loadDataEnd,

          protocolTimes: {
            applyStart: dr.protocolTimes.applyStart - dr.applyBlockStart,

            operationsDecodingStart: dr.protocolTimes.operationsDecodingStart - dr.protocolTimes.applyStart,
            operationsDecodingEnd: dr.protocolTimes.operationsDecodingEnd - dr.protocolTimes.operationsDecodingStart,

            beginApplicationStart: dr.protocolTimes.beginApplicationStart - dr.protocolTimes.operationsDecodingEnd,
            beginApplicationEnd: dr.protocolTimes.beginApplicationEnd - dr.protocolTimes.beginApplicationStart,

            finalizeBlockStart: dr.protocolTimes.finalizeBlockStart - dr.protocolTimes.beginApplicationEnd,
            finalizeBlockEnd: dr.protocolTimes.finalizeBlockEnd - dr.protocolTimes.finalizeBlockStart,

            operationsMetadataEncodingStart: dr.protocolTimes.operationsMetadataEncodingStart - dr.protocolTimes.finalizeBlockEnd,
            operationsMetadataEncodingEnd: dr.protocolTimes.operationsMetadataEncodingEnd - dr.protocolTimes.operationsMetadataEncodingStart,

            collectNewRollsOwnerSnapshotsStart: dr.protocolTimes.collectNewRollsOwnerSnapshotsStart - dr.protocolTimes.operationsMetadataEncodingEnd,
            collectNewRollsOwnerSnapshotsEnd: dr.protocolTimes.collectNewRollsOwnerSnapshotsEnd - dr.protocolTimes.collectNewRollsOwnerSnapshotsStart,

            commitStart: dr.protocolTimes.commitStart - dr.protocolTimes.collectNewRollsOwnerSnapshotsEnd,
            commitEnd: dr.protocolTimes.commitEnd - dr.protocolTimes.commitStart,

            applyEnd: dr.protocolTimes.applyEnd - dr.protocolTimes.commitEnd
          },

          applyBlockEnd: dr.applyBlockEnd - dr.protocolTimes.applyEnd,

          storeResultStart: dr.storeResultStart - dr.applyBlockEnd,
          storeResultEnd: dr.storeResultEnd - dr.storeResultStart,

          sendStart: dr.sendStart - dr.precheckEnd,
          sendEnd: dr.sendEnd - dr.sendStart,
        }
      };
      result.push(detailResult);
    });

    return result;
  }
}
