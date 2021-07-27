import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SandboxRoutingModule } from './sandbox-routing.module';
import { SandboxComponent } from '@sandbox/sandbox.component';
import { SandboxStatusBarComponent } from '@sandbox/sandbox-status-bar/sandbox-status-bar.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { MatStepperModule } from '@angular/material/stepper';
import { ChainModule } from '@chain/chain.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    SandboxComponent,
    SandboxStatusBarComponent,
  ],
  imports: [
    CommonModule,
    SandboxRoutingModule,
    TezedgeSharedModule,
    MatStepperModule,
    ChainModule,
  ]
})
export class SandboxModule {}