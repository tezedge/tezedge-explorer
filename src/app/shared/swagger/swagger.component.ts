import { Component, OnDestroy, OnInit } from '@angular/core';

declare const SwaggerUIBundle: any;

@Component({
  selector: 'app-swagger',
  templateUrl: './swagger.component.html',
  styleUrls: ['./swagger.component.scss']
})
export class SwaggerComponent implements OnInit, OnDestroy {

  private swaggerElement: HTMLElement;

  ngOnInit(): void {
    this.swaggerElement = document.getElementById('tezedge-swagger');
    this.swaggerElement.style.display = 'block';
    SwaggerUIBundle({
      dom_id: '#tezedge-swagger',
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

  ngOnDestroy(): void {
    this.swaggerElement.style.display = 'none';
  }
}
