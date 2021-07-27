import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateMachineRoutingModule } from './state-machine-routing.module';
import { StateMachineComponent } from './state-machine/state-machine.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { StateMachineDiagramComponent } from './state-machine-diagram/state-machine-diagram.component';
import { StateMachineTableComponent } from './state-machine-table/state-machine-table.component';
import { NgxObjectDiffModule } from 'ngx-object-diff';
import { StateMachineActionDetailsComponent } from './state-machine-action-details/state-machine-action-details.component';
import { MatSliderModule } from '@angular/material/slider';
import { StateMachineActionDurationPipe } from '@state-machine/state-machine-table/state-machine-action-duration.pipe';


@NgModule({
  declarations: [
    StateMachineComponent,
    StateMachineDiagramComponent,
    StateMachineTableComponent,
    StateMachineActionDetailsComponent,
    StateMachineActionDurationPipe,
  ],
  imports: [
    CommonModule,
    StateMachineRoutingModule,
    TezedgeSharedModule,
    NgxObjectDiffModule,
    MatSliderModule,
  ]
})
export class StateMachineModule {}
