import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MemoryResource } from '../../shared/types/resources/memory/memory-resource.type';
import { map } from 'rxjs/operators';

// @ts-ignore
import * as tree from './tree.json';
import { MemoryResourceName } from '../../shared/types/resources/memory/memory-resource-name.type';

@Injectable({
  providedIn: 'root'
})
export class MemoryResourcesService {

  constructor(private http: HttpClient) { }

  private serverData = (tree as any).default;

  getMemoryResources(api: string, reversed: boolean, threshold: number = 512): Observable<MemoryResource> {
    // return of(this.serverData)
    //   .pipe(map(response => this.mapMemoryResponse(response)));
    api = 'http://debug.dev.tezedge.com:17832';
    return this.http.get<MemoryResource>(`${api}/v1/tree?threshold=${threshold}&reverse=${reversed}`)
      .pipe(map(response => this.mapMemoryResponse(response, threshold)));
  }

  private mapMemoryResponse(response: any, threshold: number): MemoryResource {
    return {
      name: { ...response.name, executableName: 'root' },
      value: response.value - (response.cacheValue || 0),
      cacheValue: response.cacheValue,
      total: response.value,
      children: this.build(response.frames, threshold)
    };
  }

  private build(frames, threshold: number): MemoryResource[] {
    const children = [];
    frames
      .forEach(frame => {
        const items: MemoryResource = {
          name: this.getFrameName(frame.name, threshold),
          value: frame.value - (frame.cacheValue || 0),
          cacheValue: frame.cacheValue || 0,
          total: frame.value,
          children: this.build(frame.frames || [], threshold),
          color: this.appendColorForFrame(frame.value - (frame.cacheValue || 0))
        };
        children.push(items);
      });
    return children.sort((c1, c2) => c2.value - c1.value);
  }

  private getFrameName(name: any, threshold: number): MemoryResourceName {
    if (typeof name === 'string') {
      return {
        executableName: name === 'underThreshold' ? name + ` (${threshold} kb)` : name,
        functionName: null
      };
    }

    return {
      executableName: name.executable + '@' + name.offset,
      functionName: name.functionName
    };
  }

  private appendColorForFrame(value: number): string {
    if (value > 999999) {
      return '#eb5368';
    } else if (value > 99999) {
      return '#555558';
    } else if (value > 9999) {
      return '#3f3f43';
    } else {
      return '#2a2a2e';
    }
  }
}
