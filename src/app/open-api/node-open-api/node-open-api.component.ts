import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { BaseOpenApiComponent } from '../base-open-api.component';

@Component({
  selector: 'app-node-open-api',
  template: `
    <div #insertionPoint id="node-open-api"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeOpenApiComponent extends BaseOpenApiComponent {

  @ViewChild('insertionPoint', { static: true })
  protected insertionPoint: ElementRef<HTMLDivElement>;
  protected URL: string;

  constructor(http: HttpClient,
              store: Store<State>) {
    super(http, store);
  }

  protected buildUrl(): void {
    const hostName = this.activeNode.http;
    this.URL = hostName + '/openapi/tezedge-openapi.json';
  }
}
