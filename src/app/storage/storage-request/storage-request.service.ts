import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageRequest } from '@shared/types/storage/request/storage-request.type';
import { snakeCaseToCamelCase } from '@helpers/object.helper';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageRequestService {

  constructor(private http: HttpClient) { }

  getStorageRequests(api: string): Observable<StorageRequest[]> {
    return this.http.get<GetStorageRequestsDto>(`${api}/dev/shell/automaton/storage/requests`).pipe(
      map(response => [...response.finished.reverse(), ...response.pending.reverse()]),
      map(response => response.map(r => typeof r.requestor === 'object' ? { ...r, requestor: r.requestor.Peer } : r)),
      map(snakeCaseToCamelCase),
    );
  }
}

interface GetStorageRequestsDto {
  pending: GetStorageRequestsPending[];
  finished: GetStorageRequestsFinished[];
}

interface GetStorageRequestsPending {
  req_id: ReqId;
  pending_since: string;
  pending_for: number;
  kind: string;
  requestor: string | { Peer: string };
}

interface GetStorageRequestsFinished extends GetStorageRequestsPending {
  status: 'Success' | 'Error';
}

interface ReqId {
  locator: number;
  counter: number;
}
