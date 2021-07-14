import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { SettingsNodeApi } from '../../shared/types/settings-node/settings-node-api.type';
import { selectActiveNode } from '../../settings/settings-node/settings-node.reducer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

declare const SwaggerUIBundle: any;

@UntilDestroy()
@Component({
  selector: 'app-memory-profiler-open-api',
  template: `<div id="memory-profiler-open-api"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemoryProfilerOpenApiComponent implements OnInit {

  private readonly URL = 'https://raw.githubusercontent.com/tezedge/tezedge-debugger/develop/memory-profiler-openapi.json';

  private activeNode: SettingsNodeApi;

  constructor(private http: HttpClient,
              private store: Store<State>) { }

  ngOnInit(): void {
    this.listenToActiveNode();
    this.parseOpenApiResponse();
  }

  private listenToActiveNode(): void {
    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this))
      .subscribe((node: SettingsNodeApi) => this.activeNode = node);
  }

  private parseOpenApiResponse(): void {
    this.http.get(this.URL).subscribe((response: any) => {
      const server = response.servers[0];
      const memoryFeature = this.activeNode.features.find(f => f.name === 'resources/memory');
      if (memoryFeature) {
        const httpChunks = memoryFeature.memoryProfilerUrl.split(':');
        server.url = httpChunks[0] + ':' + httpChunks[1] + ':{port}';
        server.variables.port.enum = [httpChunks[2]];
        server.variables.port.default = httpChunks[2];
        response.servers = [server];
        this.initOpenAPI(response);
      }
    });
  }

  private initOpenAPI(data: any): void {
    SwaggerUIBundle({
      dom_id: '#memory-profiler-open-api',
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      spec: data,
      docExpansion: 'none',
      operationsSorter: 'alpha'
    });
  }
}
