import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { snakeCaseToCamelCase } from '@helpers/object.helper';
import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';
import { MempoolBlockRound } from '@shared/types/mempool/common/mempool-block-round.type';
import { MempoolBakingRightsConstants } from '@shared/types/mempool/baking-rights/mempool-baking-rights-constants.type';

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

  getBakingRightDetails(http: string, level: number, round?: number): Observable<MempoolBlockRound[]> {
    const url = `${http}/dev/shell/automaton/stats/current_head/application?level=${level}&round=${round}`;
    return this.http.get<MempoolBlockRound[]>(url).pipe(
      tap(this.handleError),
      map(snakeCaseToCamelCase),
      map(this.mapBakingRightsDetails)
    );
  }

  getMempoolConstants(http: string): Observable<MempoolBakingRightsConstants> {
    return this.http.get<MempoolBakingRightsConstants>(`${http}/chains/main/blocks/head/context/constants`).pipe(
      tap(this.handleError),
      map(response => ({
        minimalBlockDelay: Number(response.minimal_block_delay),
        delayIncrementPerRound: Number(response.delay_increment_per_round)
      }))
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

  private mapBakingRightsDetails(response: any[]): MempoolBlockRound[] {
    const result: MempoolBlockRound[] = [];
    response.forEach((detail: any) => {
      const detailResult: MempoolBlockRound = {
        blockTimestamp: detail.blockTimestamp,
        round: detail.blockRound ?? 0,
        receiveTimestamp: detail.receiveTimestamp,
        blockHash: detail.blockHash,
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
