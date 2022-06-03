import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitoringRouting } from './monitoring.routing';
import { MonitoringComponent } from '@monitoring/monitoring.component';
import { NetworkModule } from '@network/network.module';


@NgModule({
  declarations: [
    MonitoringComponent,
  ],
  imports: [
    CommonModule,
    MonitoringRouting,
    NetworkModule,
  ]
})
export class MonitoringModule {}
