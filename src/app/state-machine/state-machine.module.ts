import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateMachineRoutingModule } from './state-machine-routing.module';
import { StateMachineComponent } from './state-machine/state-machine.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { StateMachineDiagramComponent } from './state-machine-diagram/state-machine-diagram.component';
import { StateMachineTableComponent } from './state-machine-table/state-machine-table.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MatSliderModule } from '@angular/material/slider';


@NgModule({
  declarations: [
    StateMachineComponent,
    StateMachineDiagramComponent,
    StateMachineTableComponent
  ],
  imports: [
    CommonModule,
    StateMachineRoutingModule,
    TezedgeSharedModule,
    NgxJsonViewerModule,
    MatSliderModule,
  ]
})
export class StateMachineModule {}
