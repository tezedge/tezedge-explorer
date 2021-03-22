import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageBlockService {

  constructor(private http: HttpClient) { }

  getStorageBlockContextDetails(sandbox: string, blockId: string): Observable<any> {
    return this.http.get(`${sandbox}/stats/main/blocks/${blockId}`);
  }
}
