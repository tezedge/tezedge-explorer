import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import localeFr from '@angular/common/locales/fr';
import localeEnGb from '@angular/common/locales/en-GB';

import { environment } from '@environment/environment';
import { metaReducers, reducers } from '@app/app.index';
import { AppComponent } from '@app/app.component';
import { AppRouting } from '@app/app.routing';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { AppEffects } from '@app/app.effects';
import { MonitoringEffects } from '@monitoring/monitoring.effects';
import { NetworkActionEffects } from '@network/network-action/network-action.effects';
import { EndpointsActionEffects } from '@endpoints/endpoints-action/endpoints-action.effects';
import { LogsActionEffects } from '@logs/logs-action/logs-action.effects';
import { StorageBlockEffects } from '@storage/storage-block/storage-block.effects';
import { StorageActionEffects } from '@storage/storage-action/storage-action.effects';
import { StorageSearchEffects } from '@storage/storage-search/storage-search.effects';
import { SandboxEffects } from '@sandbox/sandbox.effects';
import { WalletsEffects } from '@wallets/wallets.effects';
import { SystemResourcesEffects } from '@resources/system-resource/system-resources/system-resources.effects';
import { StorageResourcesEffects } from '@resources/storage-resource/storage-resources/storage-resources.effects';
import { MemoryResourcesEffects } from '@resources/memory-resources/memory-resources.effects';
import { ErrorPopupEffects } from '@app/layout/error-popup/error-popup.effects';
import { StateMachineEffects } from '@state-machine/state-machine/state-machine.effects';
import { GithubVersionEffects } from '@app/layout/github-version/github-version.effects';
import { SettingsNodeEffects } from '@settings/settings-node.effects';

import { NgrxVirtualScrollDirective } from '@shared/ngrx-virtual-scroll.directive';
import { NavigationMenuComponent } from '@app/layout/navigation-menu/navigation-menu.component';
import { IconRegisterService } from '@core/icon-register.service';
import { ReplaceCharacterPipe } from '@shared/pipes/replace-character.pipe';
import { GithubVersionComponent } from '@app/layout/github-version/github-version.component';
import { SettingsNodeComponent } from '@settings/settings-node.component';
import { ScriptLoaderService } from '@core/script-loader.service';
import { SmartContractsEffects } from '@smart-contracts/smart-contracts/smart-contracts.effects';
import { ThemeSwitcherService } from '@core/theme-switcher.service';
import { MempoolOperationEffects } from '@mempool/operation/mempool-operation/mempool-operation.effects';
import { MempoolStatisticsEffects } from '@mempool/statistics/mempool-statistics/mempool-statistics.effects';
import { MempoolBlockApplicationEffects } from '@mempool/block-application/mempool-block-application/mempool-block-application.effects';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgrxRouterStoreModule } from '@shared/router/ngrx-router.module';
import { StorageRequestEffects } from '@storage/storage-request/storage-request.effects';
import { TezedgeAppSharedModule } from '@shared/tezedge-app-shared.module';
import { ErrorPopupComponent } from '@app/layout/error-popup/error-popup.component';
import { LoadingSpinnerComponent } from '@app/layout/loading-spinner/loading-spinner.component';
import { CUSTOM_JSON_PARSER_INTERCEPTOR } from '@core/custom-json-parser-interceptor.service';
import { StateResourcesEffects } from '@resources/state-resources/state-resources/state-resources.effects';
import { DemoComponent } from './demo/demo.component';

registerLocaleData(localeFr, 'fr');
registerLocaleData(localeEnGb, 'en');

function loadIcons(matIconService: IconRegisterService): Function {
  return () => matIconService.registerIcons();
}

function loadScripts(scriptLoaderService: ScriptLoaderService): Function {
  return () => scriptLoaderService.loadScripts();
}

function loadThemes(themeService: ThemeSwitcherService): Function {
  return () => themeService.loadThemes();
}

const EFFECTS = [
  AppEffects,
  MonitoringEffects,
  MempoolOperationEffects,
  MempoolStatisticsEffects,
  MempoolBlockApplicationEffects,
  NetworkActionEffects,
  StorageBlockEffects,
  StorageRequestEffects,
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
  StateResourcesEffects,
];

@NgModule({
  declarations: [
    AppComponent,
    SettingsNodeComponent,
    NgrxVirtualScrollDirective,
    NavigationMenuComponent,
    GithubVersionComponent,
    ErrorPopupComponent,
    LoadingSpinnerComponent,
    DemoComponent,
  ],
  imports: [
    RouterModule.forRoot(AppRouting, {
      useHash: true,
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy',
      onSameUrlNavigation: 'ignore',
    }),
    NgrxRouterStoreModule,

    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionWithinNgZone: true,
        strictStateSerializability: true
      }
    }),

    EffectsModule.forRoot(EFFECTS),

    // https://github.com/zalmoxisus/redux-devtools-extension
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],

    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TezedgeAppSharedModule,
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    DatePipe,
    ReplaceCharacterPipe,
    {
      provide: APP_INITIALIZER,
      useFactory: loadThemes,
      deps: [ThemeSwitcherService],
      multi: true
    },
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
    CUSTOM_JSON_PARSER_INTERCEPTOR,
    { provide: LOCALE_ID, useValue: 'fr' },
    { provide: LOCALE_ID, useValue: 'en' },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: 'outline' },
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
