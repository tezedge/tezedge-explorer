import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MemoryResource } from '../../shared/types/resources/memory/memory-resource.type';
import { map } from 'rxjs/operators';

// @ts-ignore
import * as tree from './tree.json';

@Injectable({
  providedIn: 'root'
})
export class MemoryResourcesService {

  constructor(private http: HttpClient) { }

  private serverData = (tree as any).default;

  getMemoryResources(api: string, threshold: number = 256): Observable<MemoryResource> {
    return of(this.serverData)
      .pipe(map(response => this.mapMemoryResponse(response)));
    // this.http.get<MemoryResource>(`${api}/v1/tree?threshold=${threshold}`)

  }

  private mapMemoryResponse(response: any): MemoryResource {
    response.frames.forEach((child, i: number) => {
      let color;
      if (i % 5 === 0) {
        color = 'rgb(191, 90, 242)';
      } else if (i % 4 === 0) {
        color = 'rgb(255, 214, 10)';
      } else if (i % 3 === 0) {
        color = 'rgb(94, 92, 230)';
      } else if (i % 2 === 0) {
        color = 'rgb(50, 215, 75)';
      } else {
        color = 'rgb(255, 45, 85)';
      }
      child.color = color;
    });
    return {
      name: { ...response.name, virtualAddress: 'rootAddress' },
      value: response.value,
      children: this.build(response.frames)
    };
  }

  private build(frames): MemoryResource[] {
    const children = [];
    frames.forEach(frame => {
      const items: MemoryResource = {
        name: frame.name,
        value: frame.value,
        children: this.build(frame.frames),
        color: frame.color
      };
      children.push(items);
    });
    return children;
  }
}
