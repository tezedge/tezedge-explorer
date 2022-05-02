import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { snakeCaseToCamelCase } from '@helpers/object.helper';
import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';

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

  private mapBakingRights(response: any[]): MempoolBakingRight[] {
    return response.map(right => ({
      address: right.address,
      blockHash: right.blockHash,
      nodeId: right.nodeId,
      receivedTime: right.receivedTime,
      sentTime: right.sentTime,
      getOperationsRecvNum: right.getOperationsRecvNum,
      operationsSendNum: right.operationsSendNum,
      getOperationsRecvStartTime: (right.getOperationsRecvStartTime && right.sentTime) ? right.getOperationsRecvStartTime - right.sentTime : undefined,
      getOperationsRecvEndTime: (right.getOperationsRecvEndTime && right.getOperationsRecvStartTime) ? right.getOperationsRecvEndTime - right.getOperationsRecvStartTime : undefined,
      operationsSendStartTime: (right.operationsSendStartTime && right.getOperationsRecvStartTime) ? right.operationsSendStartTime - right.getOperationsRecvStartTime : undefined,
      operationsSendEndTime: (right.operationsSendEndTime && right.operationsSendStartTime) ? right.operationsSendEndTime - right.operationsSendStartTime : undefined,
      responseRate: (right.operationsSendNum ?? 0) + '/' + (right.getOperationsRecvNum ?? 0),
    }));
  }

  private handleError(res): any {
    if (res.error) {
      throw new Error(res.error);
    }
  }
}
