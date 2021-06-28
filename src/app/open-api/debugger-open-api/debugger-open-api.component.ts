import { Component, OnInit } from '@angular/core';

declare const SwaggerUIBundle: any;

@Component({
  selector: 'app-debugger-open-api',
  template: `<div id="debugger-open-api"></div>`
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
      url: 'https://raw.githubusercontent.com/mambisi/tezedge/rpc-open-api-spec/spec/tezedge-openapi.json',
      docExpansion: 'none',
      operationsSorter: 'alpha'
    });
  }
}
