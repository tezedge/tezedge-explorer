import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
    return of(this.serverData)
      .pipe(map(response => this.mapMemoryResponse(response)));
    // return this.http.get<MemoryResource>(`${api}/v1/tree?threshold=${threshold}&reverse=${reversed}`)
    //   .pipe(map(response => this.mapMemoryResponse(response)));
  }

  private mapMemoryResponse(response: any): MemoryResource {
    return {
      name: { ...response.name, executableName: 'root' },
      value: response.value,
      children: this.build(response.frames)
    };
  }

  private build(frames): MemoryResource[] {
    const children = [];
    frames
      .sort((a, b) => b.value - a.value)
      .forEach(frame => {
        const items: MemoryResource = {
          name: this.getFrameName(frame.name),
          value: frame.value,
          children: this.build(frame.frames || []),
          color: this.appendColorForFrame(frame.value)
        };
        children.push(items);
      });
    return children;
  }

  private getFrameName(name: any | string): MemoryResourceName {
    if (typeof name === 'string') {
      return {
        executableName: name,
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
