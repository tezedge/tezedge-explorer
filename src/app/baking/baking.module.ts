import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BakingRouting } from './baking.routing';
import { BakingComponent } from './baking/baking.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { EffectsModule } from '@ngrx/effects';
import { BakingEffects } from '@app/baking/baking.effects';
import { BakingSummaryComponent } from './baking-summary/baking-summary.component';
import {
  BakingConnectLedgerDialogComponent
} from './baking-connect-ledger-dialog/baking-connect-ledger-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { BakingFilterComponent } from './baking-filter/baking-filter.component';
import { BakingLedgerSignDialogComponent } from './baking-ledger-sign-dialog/baking-ledger-sign-dialog.component';
import { BakingBatchListComponent } from './baking-batch-list/baking-batch-list.component';


@NgModule({
  declarations: [
    BakingComponent,
    BakingSummaryComponent,
    BakingConnectLedgerDialogComponent,
    BakingFilterComponent,
    BakingLedgerSignDialogComponent,
    BakingBatchListComponent,
  ],
  imports: [
    CommonModule,
    BakingRouting,
    TezedgeSharedModule,
    MatDialogModule,
    MatStepperModule,
    EffectsModule.forFeature([BakingEffects])
  ]
})
export class BakingModule {}
