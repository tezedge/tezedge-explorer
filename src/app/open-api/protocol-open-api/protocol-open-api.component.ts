import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

declare const SwaggerUIBundle: any;

@Component({
  selector: 'app-protocol-open-api',
  template: `<div id="protocol-open-api"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProtocolOpenApiComponent implements OnInit {

  ngOnInit(): void {
    this.initOpenAPI();
  }

  private initOpenAPI(): void {
    SwaggerUIBundle({
      dom_id: '#protocol-open-api',
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      url: 'https://raw.githubusercontent.com/tezedge/tezedge-debugger/develop/network-recorder-openapi.json',
      docExpansion: 'none',
      operationsSorter: 'alpha'
    });
  }
}
