import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MemoryResource } from '../../shared/types/resources/memory/memory-resource.type';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MemoryResourcesService {

  constructor(private http: HttpClient) { }

  getMemoryResources(api: string, threshold: number = 256): Observable<MemoryResource> {
    return this.http.get<MemoryResource>(`${ api }/v1/tree?threshold=${ threshold }`)
      .pipe(map(response => this.mapMemoryResponse(response)));
  }

  private mapMemoryResponse(response: any): MemoryResource {
    return {
      name: 'root',
      children: this.build(response.frames)
    };
  }

  private build(entity: any): MemoryResource[] {
    const children = [];
    Object.keys(entity).forEach(key => {
      const items: MemoryResource = {
        name: key,
        value: entity[key].value,
        children: this.build(entity[key].frames)
      };
      children.push(items);
    });
    return children;
  }
}
