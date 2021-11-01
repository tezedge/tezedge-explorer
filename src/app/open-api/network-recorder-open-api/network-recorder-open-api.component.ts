import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { BaseOpenApiComponent } from '@open-api/base-open-api.component';

@Component({
  selector: 'app-network-recorder-open-api',
  template: `
    <div #insertionPoint id="network-recorder-open-api"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkRecorderOpenApiComponent extends BaseOpenApiComponent {

  @ViewChild('insertionPoint', { static: true })
  protected insertionPoint: ElementRef<HTMLDivElement>;
  protected URL: string;

  constructor(http: HttpClient,
              store: Store<State>) {
    super(http, store);
  }

  protected buildUrl(): void {
    const hostName = this.activeNode.features.find(f => f.name === 'debugger').url;
    this.URL = hostName + '/openapi/network-recorder-openapi.json';
  }
}
