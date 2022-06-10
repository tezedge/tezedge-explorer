import { NgModule } from '@angular/core';

import { LogsRoutingModule } from './logs.routing';
import { LogsActionComponent } from './logs-action/logs-action.component';
import { LogsComponent } from './logs/logs.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LogsComponent,
    LogsActionComponent,
  ],
  imports: [
    LogsRoutingModule,
    TezedgeSharedModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ]
})
export class LogsModule { }
