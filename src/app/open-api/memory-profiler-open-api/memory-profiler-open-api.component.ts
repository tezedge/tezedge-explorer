import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { BaseOpenApiComponent } from '@open-api/base-open-api.component';

@Component({
  selector: 'app-memory-profiler-open-api',
  template: `
    <div #insertionPoint id="memory-profiler-open-api"></div>`
  ,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemoryProfilerOpenApiComponent extends BaseOpenApiComponent {

  @ViewChild('insertionPoint', { static: true })
  protected insertionPoint: ElementRef<HTMLDivElement>;
  protected URL: string;

  constructor(http: HttpClient,
              store: Store<State>) {
    super(http, store);
  }

  protected buildUrl(): void {
    const hostName = this.activeNode.features.find(f => f.memoryProfilerUrl).memoryProfilerUrl;
    this.URL = hostName + '/openapi/memory-profiler-openapi.json';
  }
}
