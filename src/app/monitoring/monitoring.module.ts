import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitoringRoutingModule } from './monitoring-routing.module';
import { MonitoringComponent } from '@monitoring/monitoring.component';
import { NetworkModule } from '@network/network.module';


@NgModule({
  declarations: [
    MonitoringComponent,
  ],
  imports: [
    CommonModule,
    MonitoringRoutingModule,
    NetworkModule,
  ]
})
export class MonitoringModule {}
