import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MempoolBakingRightsState } from '@shared/types/mempool/baking-rights/mempool-baking-rights-state.type';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { snakeCaseToCamelCase } from '@helpers/object.helper';

@Injectable({
  providedIn: 'root'
})
export class MempoolBakingRightsService {

  constructor(private http: HttpClient) { }

  getBakingRights(http: string, level: number): Observable<Partial<MempoolBakingRightsState>> {
    const url = `${http}/dev/shell/automaton/stats/current_head?level=${level}`;
    return this.http.get<Partial<MempoolBakingRightsState>>(url).pipe(
      map(snakeCaseToCamelCase),
      // map((response: Partial<MempoolBakingRightsState>) => {
      //   return {
      //     ...response,
      //     currentHeads: response.currentHeads.map(right => ({
      //       ...right,
      //       delta: (right.sentTime && right.receivedTime) ? (right.sentTime - right.receivedTime) : right.delta
      //     }))
      //   };
      // })
    );
  }
}
