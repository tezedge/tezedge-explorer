import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

declare const SwaggerUIBundle: any;

@Component({
  selector: 'app-debugger-open-api',
  template: `<div id="debugger-open-api"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebuggerOpenApiComponent implements OnInit {

  ngOnInit(): void {
    this.initOpenAPI();
  }

  private initOpenAPI(): void {
    SwaggerUIBundle({
      dom_id: '#debugger-open-api',
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
