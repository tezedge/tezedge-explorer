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
    return this.http.get<StorageRequest[]>(`${api}/dev/shell/automaton/storage/requests`).pipe(
      map(snakeCaseToCamelCase)
    );
  }
}
