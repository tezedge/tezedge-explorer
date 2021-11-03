import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MempoolOperationService {

  constructor(private http: HttpClient) { }

  getOperations(api: string): Observable<any> {
    return this.http.get<any>(api + '/chains/main/mempool/pending_operations');
  }
}
