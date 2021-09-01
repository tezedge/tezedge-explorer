import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppComponent } from '@app/app.component';
import { AppRouting } from '@app/app.routing';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { metaReducers, reducers } from '@app/app.reducers';
import { environment } from '@environment/environment';

import { AppEffects } from '@app/app.effects';

import { MonitoringEffects } from '@monitoring/monitoring.effects';

import { MempoolActionEffects } from '@mempool/mempool-action/mempool-action.effects';

import { NetworkActionEffects } from '@network/network-action/network-action.effects';

import { EndpointsActionEffects } from '@endpoints/endpoints-action/endpoints-action.effects';

import { LogsActionEffects } from '@logs/logs-action/logs-action.effects';

import { StorageBlockEffects } from '@storage/storage-block/storage-block.effects';
import { StorageActionEffects } from '@storage/storage-action/storage-action.effects';
import { StorageSearchEffects } from '@storage/storage-search/storage-search.effects';

import { SandboxEffects } from '@sandbox/sandbox.effects';
import { WalletsEffects } from '@wallets/wallets.effects';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { NgrxVirtualScrollDirective } from '@shared/ngrx-virtual-scroll.directive';
import { SystemResourcesEffects } from '@resources/system-resources/system-resources.effects';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { NavigationMenuComponent } from './layout/navigation-menu/navigation-menu.component';
import { DatePipe, registerLocaleData } from '@angular/common';
import { StorageResourcesEffects } from '@resources/storage-resources/storage-resources.effects';
import { MemoryResourcesEffects } from '@resources/memory-resources/memory-resources.effects';
import { IconRegisterService } from '@shared/design/icon/icon-register.service';
import localeFr from '@angular/common/locales/fr';
import localeEnGb from '@angular/common/locales/en-GB';
import { ReplaceCharacterPipe } from '@shared/pipes/replace-character.pipe';
import { ErrorPopupEffects } from '@shared/error-popup/error-popup.effects';
import { VarDirective } from '@shared/directives/var.directive';
import { MatNativeDateModule } from '@angular/material/core';
import { StateMachineEffects } from '@state-machine/state-machine/state-machine.effects';
import { CommitNumberEffects } from '@app/layout/commit-number/commit-number.effects';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { CommitNumberComponent } from '@app/layout/commit-number/commit-number.component';
import { SettingsNodeComponent } from '@settings/settings-node.component';
import { SettingsNodeEffects } from '@settings/settings-node.effects';

registerLocaleData(localeFr, 'fr');
registerLocaleData(localeEnGb, 'en');

function loadIcons(matIconService: IconRegisterService): Function {
  return () => matIconService.loadIcons();
}

@NgModule({
  declarations: [
    AppComponent,
    SettingsNodeComponent,
    NgrxVirtualScrollDirective,
    NavigationMenuComponent,
    CommitNumberComponent,
  ],
  imports: [
    BrowserModule,
    // disable material animations
    // BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpClientModule,
    TezedgeSharedModule,

    RouterModule.forRoot(AppRouting, {
      useHash: true,
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy',
      onSameUrlNavigation: 'ignore'
    }),

    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionWithinNgZone: true,
        strictStateSerializability: true
      }
    }),

    EffectsModule.forRoot([
      AppEffects,
      MonitoringEffects,
      MempoolActionEffects,
      NetworkActionEffects,
      StorageBlockEffects,
      StorageActionEffects,
      StorageSearchEffects,
      EndpointsActionEffects,
      LogsActionEffects,
      SettingsNodeEffects,
      SandboxEffects,
      WalletsEffects,
      CommitNumberEffects,
      SystemResourcesEffects,
      StorageResourcesEffects,
      MemoryResourcesEffects,
      ErrorPopupEffects,
      StateMachineEffects,
    ]),

    // https://github.com/zalmoxisus/redux-devtools-extension
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],

    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatTooltipModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    DatePipe,
    ReplaceCharacterPipe,
    {
      provide: APP_INITIALIZER,
      useFactory: loadIcons,
      deps: [IconRegisterService],
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'fr' },
    { provide: LOCALE_ID, useValue: 'en' },
  ],
  exports: [
    VarDirective,
    SvgIconComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
