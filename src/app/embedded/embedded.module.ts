import { NgModule } from '@angular/core';

import { EmbeddedRouting } from './embedded.routing';
import { EmbeddedComponent } from './embedded/embedded.component';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import {
  TezedgeNgxJsonViewerModule
} from '@shared/components/custom-tezedge-components/tezedge-ngx-json-viewer/tezedge-ngx-json-viewer.module';
import { EffectsModule } from '@ngrx/effects';
import { EmbeddedEffects } from '@app/embedded/embedded.effects';
import { EmbeddedFiltersComponent } from './embedded-filters/embedded-filters.component';


@NgModule({
  declarations: [
    EmbeddedComponent,
    EmbeddedFiltersComponent
  ],
  imports: [
    EmbeddedRouting,
    TezedgeSharedModule,
    TezedgeNgxJsonViewerModule,
    EffectsModule.forFeature([EmbeddedEffects])
  ]
})
export class EmbeddedModule {}
