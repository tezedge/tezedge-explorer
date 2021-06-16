import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MemoryResource } from '../../shared/types/resources/memory/memory-resource.type';
import { MemoryResourceName } from '../../shared/types/resources/memory/memory-resource-name.type';
import { map } from 'rxjs/operators';

// @ts-ignore
import * as tree from './tree.json';

@Injectable({
  providedIn: 'root'
})
export class MemoryResourcesService {

  constructor(private http: HttpClient) { }

  private serverData = (tree as any).default;

  getStorageResources(api: string, reversed: boolean, threshold: number = 512): Observable<MemoryResource> {
    // return of(this.serverData)
    //   .pipe(map(response => this.mapMemoryResponse(response, threshold)));
    return this.http.get<MemoryResource>(`${api}/v1/tree?threshold=${threshold}&reverse=${reversed}`)
      .pipe(map(response => this.mapMemoryResponse(response, threshold)));
  }

  private mapMemoryResponse(response: any, threshold: number): MemoryResource {
    return {
      name: { ...response.name, executableName: 'root' },
      value: round(response.value - (response.cacheValue || 0)),
      total: round(response.value),
      children: this.build(response.frames, threshold)
    };
  }

  private build(frames, threshold: number): MemoryResource[] {
    const children = [];
    frames
      .forEach(frame => {
        const size = round(frame.value - (frame.cacheValue || 0));
        const items: MemoryResource = {
          name: this.getFrameName(frame.name, threshold),
          value: size,
          total: round(frame.value),
          children: this.build(frame.frames || [], threshold),
          color: this.appendColorForFrame(size)
        };
        children.push(items);
      });
    return children.sort((c1, c2) => c2.value - c1.value);
  }

  private getFrameName(name: any, threshold: number): MemoryResourceName {
    if (typeof name === 'string') {
      return {
        executableName: name === 'underThreshold' ? `below ${round(threshold)} mb` : name,
        functionName: null,
      };
    }

    return {
      executableName: name.executable + '@' + name.offset,
      functionName: name.functionName
    };
  }

  private appendColorForFrame(value: number): string {
    if (value > 999.99) {
      return '#eb5368';
    } else if (value > 99.99) {
      return '#555558';
    } else if (value > 9.99) {
      return '#3f3f43';
    } else {
      return '#2a2a2e';
    }
  }
}

const round = (num): number => {
  return +(Math.round(Number((num / 1024) + 'e+2')) + 'e-2');
};
