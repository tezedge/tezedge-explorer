import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TezedgeNgxJsonViewerComponent } from '@shared/custom-components/tezedge-ngx-json-viewer/tezedge-ngx-json-viewer/tezedge-ngx-json-viewer.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';


@NgModule({
  declarations: [
    TezedgeNgxJsonViewerComponent
  ],
  exports: [
    TezedgeNgxJsonViewerComponent
  ],
  imports: [
    CommonModule,
    NgxJsonViewerModule,
  ]
})
export class TezedgeNgxJsonViewerModule { }
