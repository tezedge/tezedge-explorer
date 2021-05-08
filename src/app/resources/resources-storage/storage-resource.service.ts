import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageResourcesStats } from '../../shared/types/resources/storage/storage-resources-stats.type';

@Injectable({
  providedIn: 'root'
})
export class StorageResourceService {

  constructor(private http: HttpClient) { }

  getStorageResources(api: string): Observable<StorageResourcesStats> {
    return this.http.get<StorageResourcesStats>(api + '/stats/context');
  }
}
