import { NgModule } from '@angular/core';

import { BakingRouting } from './baking.routing';
import { BakingComponent } from './baking/baking.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import {
  TezedgeNgxJsonViewerModule
} from '@shared/components/custom-tezedge-components/tezedge-ngx-json-viewer/tezedge-ngx-json-viewer.module';
import { EffectsModule } from '@ngrx/effects';
import { BakingEffects } from '@app/baking/baking.effects';
import { BakingFiltersComponent } from './baking-filters/baking-filters.component';


@NgModule({
  declarations: [
    BakingComponent,
    BakingFiltersComponent
  ],
  imports: [
    BakingRouting,
    TezedgeSharedModule,
    TezedgeNgxJsonViewerModule,
    EffectsModule.forFeature([BakingEffects])
  ]
})
export class BakingModule {}
