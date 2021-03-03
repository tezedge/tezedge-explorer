import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { metaReducers, reducers } from './app.reducers';
import { environment } from '../environments/environment';

import { AppEffects } from './app.effects';

import { MonitoringEffects } from './monitoring/monitoring.effects';

import { MempoolActionEffects } from './mempool/mempool-action/mempool-action.effects';

import { NetworkActionEffects } from './network/network-action/network-action.effects';
import { NetworkActionDetailEffects } from './network/network-action-detail/network-action-detail.effects';

import { EndpointsActionEffects } from './endpoints/endpoints-action/endpoints-action.effects';

import { LogsActionEffects } from './logs/logs-action/logs-action.effects';

import { StorageBlockEffects } from './storage/storage-block/storage-block.effects';
import { StorageActionEffects } from './storage/storage-action/storage-action.effects';
import { StorageSearchEffects } from './storage/storage-search/storage-search.effects';

import { SettingsNodeEffects } from './settings/settings-node/settings-node.effects';
import { SandboxEffects } from './sandbox/sandbox.effects';
import { WalletsEffects } from './wallets/wallets.effects';

import { NetworkComponent } from './network/network.component';
import { NetworkPeersComponent } from './network/network-peers/network-peers.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { NetworkStatsComponent } from './network/network-stats/network-stats.component';
import { NetworkHistoryComponent } from './network/network-history/network-history.component';
import { NetworkEndpointComponent } from './network/network-endpoint/network-endpoint.component';

// TODO: replace with reactive forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BandwidthPipe } from './shared/bandwidth.pipe';
import { StorageComponent } from './storage/storage.component';
import { StorageBlockComponent } from './storage/storage-block/storage-block.component';
import { StorageActionComponent } from './storage/storage-action/storage-action.component';
import { StorageSearchComponent } from './storage/storage-search/storage-search.component';
import { NetworkActionComponent } from './network/network-action/network-action.component';
import { NetworkSearchComponent } from './network/network-search/network-search.component';
import { NetworkActionDetailComponent } from './network/network-action-detail/network-action-detail.component';
import { MonitoringComponent } from './monitoring/monitoring.component';

import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { EndpointsActionComponent } from './endpoints/endpoints-action/endpoints-action.component';
import { EndpointsSearchComponent } from './endpoints/endpoints-search/endpoints-search.component';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { SettingsNodeComponent } from './settings/settings-node/settings-node.component';
import { LogsActionComponent } from './logs/logs-action/logs-action.component';
import { LogsSearchComponent } from './logs/logs-search/logs-search.component';
import { LogsComponent } from './logs/logs.component';

import { ChainComponent } from './chain/chain.component';
import { ChainServerComponent } from './chain/chain-server/chain-server.component';
import { ChainConfigComponent } from './chain/chain-config/chain-config.component';
import { ChainWalletsComponent } from './chain/chain-wallets/chain-wallets.component';
import { ChainBakingComponent } from './chain/chain-baking/chain-baking.component';
import { ChainFinishComponent } from './chain/chain-finish/chain-finish.component';

import { ChainOtherComponent } from './chain/chain-other/chain-other.component';
import { SandboxComponent } from './sandbox/sandbox.component';

import { NgrxFormDirective } from './shared/ngrx-form.directive';
import { NgrxVirtualScrollDirective } from './shared/ngrx-virtual-scroll.directive';
import { VirtualScrollDirective } from './shared/virtual-scroll.directive';

import { SandboxStatusBarComponent } from './sandbox/sandbox-status-bar/sandbox-status-bar.component';
import { WalletsComponent } from './wallets/wallets.component';
import { MempoolComponent } from './mempool/mempool.component';
import { MempoolActionComponent } from './mempool/mempool-action/mempool-action.component';
import { CommitNumberComponent } from './monitoring/commit-number/commit-number.component';
import { CommitNumberEffects } from './monitoring/commit-number/commit-number.effects';
import { ResourcesEffects } from './resources/resources/resources.effects';
import { TezedgeSharedModule } from './shared/tezedge-shared.module';

@NgModule({
  declarations: [
    AppComponent,
    NetworkComponent,
    NetworkPeersComponent,
    NetworkStatsComponent,
    NetworkHistoryComponent,
    NetworkEndpointComponent,
    BandwidthPipe,
    StorageComponent,
    StorageBlockComponent,
    StorageActionComponent,
    StorageSearchComponent,
    NetworkActionComponent,
    NetworkSearchComponent,
    NetworkActionDetailComponent,
    MonitoringComponent,
    EndpointsActionComponent,
    EndpointsSearchComponent,
    EndpointsComponent,
    SettingsNodeComponent,
    LogsActionComponent,
    LogsSearchComponent,
    LogsComponent,
    ChainComponent,
    ChainServerComponent,
    ChainConfigComponent,
    ChainWalletsComponent,
    ChainBakingComponent,
    ChainFinishComponent,
    ChainOtherComponent,
    NgrxFormDirective,
    NgrxVirtualScrollDirective,
    VirtualScrollDirective,
    SandboxComponent,
    SandboxStatusBarComponent,
    WalletsComponent,
    MempoolComponent,
    MempoolActionComponent,
    CommitNumberComponent
  ],
  imports: [
    BrowserModule,
    // disable material animations
    // BrowserAnimationsModule,
    NoopAnimationsModule,
    ScrollingModule,
    HttpClientModule,
    TezedgeSharedModule,

    // loading routing
    RouterModule.forRoot(AppRouting, {
      useHash: true,
      // preload all modules
      preloadingStrategy: PreloadAllModules,
      // scroll page to top on route change
      scrollPositionRestoration: 'enabled'
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
      NetworkActionDetailEffects,
      StorageBlockEffects,
      StorageActionEffects,
      StorageSearchEffects,
      EndpointsActionEffects,
      LogsActionEffects,
      SettingsNodeEffects,
      SandboxEffects,
      WalletsEffects,
      CommitNumberEffects,
      ResourcesEffects,
    ]),

    // https://github.com/zalmoxisus/redux-devtools-extension
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],

    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatTableModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    ClipboardModule,

    NgxChartsModule,

    FormsModule,
    ReactiveFormsModule,
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

    NgxJsonViewerModule,
    TezedgeSharedModule

  ],
  providers: [],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
