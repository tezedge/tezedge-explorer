import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResourcesRoutingModule } from './resources-routing.module';
import { ResourcesComponent } from './components/resources/resources.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TezedgeSharedModule } from '../shared/tezedge-shared.module';
import { ResourcesAdditionalInfoComponent } from './components/resources-additional-info/resources-additional-info.component';


@NgModule({
  declarations: [
    ResourcesComponent,
    ResourcesAdditionalInfoComponent,
  ],
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    NgxChartsModule,
    TezedgeSharedModule,
  ]
})
export class ResourcesModule {}
