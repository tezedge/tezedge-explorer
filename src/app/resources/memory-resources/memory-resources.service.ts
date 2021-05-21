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
      .forEach((frame, i) => {
      const items: MemoryResource = {
        name: this.getFrameName(frame.name),
        value: frame.value,
        children: this.build(frame.frames || []),
        color: this.appendColorForFrame(i)
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

  private appendColorForFrame(i: number): string {
    if (i % 5 === 0) {
      return '#bf5af2';
    } else if (i % 4 === 0) {
      return '#ffd60a';
    } else if (i % 3 === 0) {
      return '#5e5ce6';
    } else if (i % 2 === 0) {
      return '#32d74b';
    } else {
      return '#ff2d55';
    }
  }
}
