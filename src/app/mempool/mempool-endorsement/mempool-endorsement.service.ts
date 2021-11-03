import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MempoolEndorsement } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement.type';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MempoolEndorsementService {

  private bakersDetails = {};

  constructor(private http: HttpClient) {
    this.http.get<any>('assets/json/mempool-bakers.json').subscribe(bakers => this.bakersDetails = bakers);
  }

  getEndorsementStatusUpdates(api: string): Observable<{ [p: string]: MempoolEndorsement }> {
    return this.http.get<any>(api + '/dev/shell/automaton/endorsements_status').pipe(
      map(response => {
        const updates = Object.keys(response).map(key => ({
          [response[key].slot]: {
            status: response[key].state,
            receiveHashTime: response[key].received_hash_time,
            receiveContentsTime: response[key].received_contents_time,
            applyTime: response[key].applied_time,
            decodeTime: response[key].decoded_time,
            precheckTime: response[key].prechecked_time,
            broadcastTime: response[key].broadcast_time,
            delta: (response[key].received_hash_time && response[key].broadcast_time) ? (response[key].broadcast_time - response[key].received_hash_time) : undefined
          }
        }));
        return Object.assign({}, ...updates);
      })
    );
  }

  getEndorsements(api: string, blockHash: string, level: number): Observable<MempoolEndorsement[]> {
    const url = `${api}/dev/shell/automaton/endorsing_rights?block=${blockHash}&level=${level}`;
    return this.http.get<{ [p: string]: number[] }>(url).pipe(
      map(MempoolEndorsementService.handleError),
      map((value: { [p: string]: number[] }) => {
        const endorsements: MempoolEndorsement[] = Object.keys(value).map(key => ({
          bakerName: this.bakersDetails[key]?.name || key,
          bakerHash: key,
          logo: this.bakersDetails[key]?.logo,
          slots: value[key],
          slotsLength: value[key].length
        }));
        return endorsements;
      })
    );
  }

  private static handleError(response: any): object {
    if (Array.isArray(response[Object.keys(response)[0]])) {
      return response;
    }
    return {};
  }
}
