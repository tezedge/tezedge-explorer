import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MempoolPartialRound } from '@shared/types/mempool/common/mempool-partial-round.type';
import { MempoolPreEndorsement } from '@shared/types/mempool/preendorsement/mempool-preendorsement.type';

@Injectable({
  providedIn: 'root'
})
export class MempoolPreEndorsementService {

  private bakersDetails = {};

  constructor(private http: HttpClient) {
    this.http.get<any>('assets/json/mempool-bakers.json').subscribe(bakers => this.bakersDetails = bakers);
  }

  getPreEndorsingRights(api: string, blockHash: string, level: number): Observable<MempoolPreEndorsement[]> {
    const url = `${api}/chains/main/blocks/${blockHash}/helpers/validators?level=${level}`;
    return this.http.get<any[]>(url).pipe(
      map((bakerList: any[]) => {
        const endorsements: MempoolPreEndorsement[] = bakerList.map(baker => ({
          bakerName: this.bakersDetails[baker.delegate]?.name || baker.delegate,
          bakerHash: baker.delegate,
          logo: this.bakersDetails[baker.delegate]?.logo,
          slots: baker.slots,
          slotsLength: baker.slots.length
        }));
        return endorsements;
      })
    );
  }

  getPreEndorsementStatusUpdates(api: string, round: MempoolPartialRound): Observable<{ [p: string]: MempoolPreEndorsement }> {
    const url = `${api}/dev/shell/automaton/preendorsements_status?level=${round.blockLevel}&round=${round.round}&base_time=${round.blockRecTimestamp}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        const updates = Object.keys(response).map(key => {
          return ({
            [response[key].slot]: {
              status: response[key].state,
              operationHash: key,
              receiveHashTime: response[key].received_hash_time,
              receiveContentsTime: response[key].received_contents_time,
              decodeTime: response[key].decoded_time,
              precheckTime: response[key].prechecked_time,
              applyTime: response[key].applied_time,
              broadcastTime: response[key].broadcast === 'not_needed' ? 'Not needed' : response[key].broadcast_time,
              delta: (response[key].received_hash_time && response[key].broadcast_time)
                ? (response[key].broadcast_time - response[key].received_hash_time)
                : undefined
            }
          });
        });
        return Object.assign({}, ...updates);
      })
    );
  }
}
