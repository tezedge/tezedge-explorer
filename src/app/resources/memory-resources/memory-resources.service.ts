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
    return this.http.get<MemoryResource>(`${api}/v1/tree?threshold=${threshold}`)
      .pipe(map(response => this.mapMemoryResponse(response)));
  }

  private mapMemoryResponse(response: any): MemoryResource {
    const resource = {
      name: 'root',
      value: response.value,
      children: this.build(response.frames)
    };
    response.frames.forEach((child, i: number) => {
      let color;
      if (i % 5 === 0) {
        color = 'rgba(191, 90, 242)';
      } else if (i % 4 === 0) {
        color = 'rgba(255, 214, 10)';
      } else if (i % 3 === 0) {
        color = 'rgba(94, 92, 230)';
      } else if (i % 2 === 0) {
        color = 'rgba(50, 215, 75)';
      } else {
        color = 'rgba(255, 45, 85)';
      }
      child.color = color;
    });
    return resource as any;
  }

  private build(frames): MemoryResource[] {
    const children = [];
    frames.forEach(frame => {
      const items: MemoryResource = {
        name: frame.name.virtualAddress as any,
        value: frame.value,
        children: this.build(frame.frames)
      };
      children.push(items);
    });
    return children;
  }
}
