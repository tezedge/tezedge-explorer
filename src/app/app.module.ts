import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import localeFr from '@angular/common/locales/fr';
import localeEnGb from '@angular/common/locales/en-GB';

import { environment } from '@environment/environment';
import { metaReducers, reducers } from '@app/app.reducers';
import { AppComponent } from '@app/app.component';
import { AppRouting } from '@app/app.routing';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

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
import { SystemResourcesEffects } from '@resources/system-resources/system-resources.effects';
import { StorageResourcesEffects } from '@resources/storage-resources/storage-resources.effects';
import { MemoryResourcesEffects } from '@resources/memory-resources/memory-resources.effects';
import { ErrorPopupEffects } from '@shared/error-popup/error-popup.effects';
import { StateMachineEffects } from '@state-machine/state-machine/state-machine.effects';
import { GithubVersionEffects } from '@app/layout/github-version/github-version.effects';
import { SettingsNodeEffects } from '@settings/settings-node.effects';

import { NgrxVirtualScrollDirective } from '@shared/ngrx-virtual-scroll.directive';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { NavigationMenuComponent } from '@app/layout/navigation-menu/navigation-menu.component';
import { IconRegisterService } from '@core/icon-register.service';
import { ReplaceCharacterPipe } from '@shared/pipes/replace-character.pipe';
import { GithubVersionComponent } from '@app/layout/github-version/github-version.component';
import { SettingsNodeComponent } from '@settings/settings-node.component';
import { ScriptLoaderService } from '@core/script-loader.service';
import { SmartContractsEffects } from '@smart-contracts/smart-contracts/smart-contracts.effects';
import { MempoolEffects } from '@mempool/mempool.effects';

registerLocaleData(localeFr, 'fr');
registerLocaleData(localeEnGb, 'en');

function loadIcons(matIconService: IconRegisterService): Function {
  return () => matIconService.registerIcons();
}

function loadScripts(scriptLoaderService: ScriptLoaderService): Function {
  return () => scriptLoaderService.loadScripts();
}

const effects = [
  AppEffects,
  MonitoringEffects,
  MempoolActionEffects,
  MempoolEffects,
  NetworkActionEffects,
  StorageBlockEffects,
  StorageActionEffects,
  StorageSearchEffects,
  EndpointsActionEffects,
  LogsActionEffects,
  SettingsNodeEffects,
  SandboxEffects,
  WalletsEffects,
  GithubVersionEffects,
  SystemResourcesEffects,
  StorageResourcesEffects,
  MemoryResourcesEffects,
  ErrorPopupEffects,
  StateMachineEffects,
  SmartContractsEffects,
];

@NgModule({
  declarations: [
    AppComponent,
    SettingsNodeComponent,
    NgrxVirtualScrollDirective,
    NavigationMenuComponent,
    GithubVersionComponent,
  ],
  imports: [
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

    EffectsModule.forRoot(effects),

    // https://github.com/zalmoxisus/redux-devtools-extension
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],

    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TezedgeSharedModule,
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
    {
      provide: APP_INITIALIZER,
      useFactory: loadScripts,
      deps: [ScriptLoaderService],
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'fr' },
    { provide: LOCALE_ID, useValue: 'en' },
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
