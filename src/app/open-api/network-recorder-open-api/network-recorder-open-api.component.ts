import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

declare const SwaggerUIBundle: any;

@Component({
  selector: 'app-network-recorder-open-api',
  template: `<div id="network-recorder-open-api"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkRecorderOpenApiComponent implements OnInit {

  ngOnInit(): void {
    this.initOpenAPI();
  }

  private initOpenAPI(): void {
    SwaggerUIBundle({
      dom_id: '#network-recorder-open-api',
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
