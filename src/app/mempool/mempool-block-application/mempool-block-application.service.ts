import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MempoolBlockApplication } from '@shared/types/mempool/block-application/mempool-block-application.type';
import { map } from 'rxjs/operators';
import { toReadableDate } from '@helpers/date.helper';
import { snakeCaseToCamelCase } from '@helpers/object.helper';

@Injectable({
  providedIn: 'root'
})
export class MempoolBlockApplicationService {

  constructor(private http: HttpClient) { }

  getBlockApplication(api: string): Observable<MempoolBlockApplication[]> {
    const limit = 2000;
    const url = `${api}/dev/shell/automaton/block_stats/graph?limit=${limit}`;
    // return this.http.get<MempoolBlockApplication[]>('assets/json/mempool-block-application-mock.json').pipe(
    return this.http.get<MempoolBlockApplication[]>(url).pipe(
      map(snakeCaseToCamelCase),
      map((response: any[]) => {
        return response.slice(0, limit - 1).map(value => ({
          ...value,
          blockFirstSeen: toReadableDate(value.blockFirstSeen),
          totalTime: value.dataReady + value.loadData + value.applyBlock + value.storeResult
        }));
      })
    );
  }
}
