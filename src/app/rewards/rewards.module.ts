import { NgModule } from '@angular/core';

import { RewardsRouting } from './rewards.routing';
import { RewardsComponent } from './rewards/rewards.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { EffectsModule } from '@ngrx/effects';
import { RewardsEffects } from '@rewards/rewards.effects';
import { RewardsSummaryComponent } from './rewards-summary/rewards-summary.component';
import {
  RewardsConnectLedgerDialogComponent
} from './rewards-connect-ledger-dialog/rewards-connect-ledger-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { RewardsFilterComponent } from './rewards-filter/rewards-filter.component';
import { RewardsLedgerSignDialogComponent } from './rewards-ledger-sign-dialog/rewards-ledger-sign-dialog.component';
import { RewardsBatchListComponent } from './rewards-batch-list/rewards-batch-list.component';


@NgModule({
  declarations: [
    RewardsComponent,
    RewardsSummaryComponent,
    RewardsConnectLedgerDialogComponent,
    RewardsFilterComponent,
    RewardsLedgerSignDialogComponent,
    RewardsBatchListComponent,
  ],
  imports: [
    RewardsRouting,
    TezedgeSharedModule,
    MatDialogModule,
    MatStepperModule,
    EffectsModule.forFeature([RewardsEffects])
  ]
})
export class RewardsModule {}
