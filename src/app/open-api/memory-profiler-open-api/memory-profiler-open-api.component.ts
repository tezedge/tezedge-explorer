import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

declare const SwaggerUIBundle: any;

@Component({
  selector: 'app-memory-profiler-open-api',
  template: `<div id="memory-profiler-open-api"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemoryProfilerOpenApiComponent implements OnInit {

  ngOnInit(): void {
    this.initOpenAPI();
  }

  private initOpenAPI(): void {
    SwaggerUIBundle({
      dom_id: '#memory-profiler-open-api',
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      url: 'https://raw.githubusercontent.com/tezedge/tezedge-debugger/develop/memory-profiler-openapi.json',
      docExpansion: 'none',
      operationsSorter: 'alpha'
    });
  }
}
