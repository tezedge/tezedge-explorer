import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { TezedgeNgxJsonViewerComponent } from '@shared/components/custom-tezedge-components/tezedge-ngx-json-viewer/tezedge-ngx-json-viewer/tezedge-ngx-json-viewer.component';


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
