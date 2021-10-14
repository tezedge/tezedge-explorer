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
import { TezedgeNgxJsonViewerModule } from '@shared/custom-components/tezedge-ngx-json-viewer/tezedge-ngx-json-viewer.module';


@NgModule({
  declarations: [
    StateMachineComponent,
    StateMachineDiagramComponent,
    StateMachineTableComponent,
    StateMachineActionDetailsComponent,
  ],
  imports: [
    CommonModule,
    StateMachineRoutingModule,
    TezedgeSharedModule,
    NgxObjectDiffModule,
    MatSliderModule,
    TezedgeNgxJsonViewerModule,
  ]
})
export class StateMachineModule {}
