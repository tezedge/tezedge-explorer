import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { reducers, metaReducers } from './app.reducers';
import { environment } from '../environments/environment';

import { AppEffects } from './app.effects';

import { MonitoringEffects } from './monitoring/monitoring.effects';

import { NetworkActionEffects } from './network/network-action/network-action.effects';
import { NetworkActionDetailEffects } from './network/network-action-detail/network-action-detail.effects';

import { EndpointsActionEffects } from './endpoints/endpoints-action/endpoints-action.effects';

import { StorageBlockEffects } from './storage/storage-block/storage-block.effects';
import { StorageActionEffects } from './storage/storage-action/storage-action.effects';
import { StorageSearchEffects } from './storage/storage-search/storage-search.effects';

import { SettingsEffects } from './settings/settings.effects';
import { SettingsNodeEffects } from './settings/settings-node/settings-node.effects';

import { NetworkComponent } from './network/network.component';
import { NetworkPeersComponent } from './network/network-peers/network-peers.component';


import { MatAutocompleteModule } from '@angular/material/autocomplete'; 
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule  } from '@angular/material/button-toggle';
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

import { NetworkStatsComponent } from './network/network-stats/network-stats.component';
import { NetworkHistoryComponent } from './network/network-history/network-history.component';
import { SettingsComponent } from './settings/settings.component';
import { NetworkEndpointComponent } from './network/network-endpoint/network-endpoint.component';

// TODO: replace woth reactive forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BandwidthPipe } from './shared/bandwidth.pipe';
import { StorageComponent } from './storage/storage.component';
import { StorageBlockComponent } from './storage/storage-block/storage-block.component';
import { StorageActionComponent } from './storage/storage-action/storage-action.component';
import { StorageSearchComponent } from './storage/storage-search/storage-search.component';
import { SvgIconComponent } from './shared/svg-icon/svg-icon.component';
import { NetworkActionComponent } from './network/network-action/network-action.component';
import { NetworkSearchComponent } from './network/network-search/network-search.component';
import { NetworkActionDetailComponent } from './network/network-action-detail/network-action-detail.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { ServiceWorkerModule } from '@angular/service-worker';

import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { EndpointsActionComponent } from './endpoints/endpoints-action/endpoints-action.component';
import { EndpointsSearchComponent } from './endpoints/endpoints-search/endpoints-search.component';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { SettingsNodeComponent } from './settings/settings-node/settings-node.component';
import { LogsActionComponent } from './logs/logs-action/logs-action.component';
import { LogsSearchComponent } from './logs/logs-search/logs-search.component';
import { LogsComponent } from './logs/logs.component';


@NgModule({
  declarations: [
    AppComponent,
    NetworkComponent,
    NetworkPeersComponent,
    NetworkStatsComponent,
    NetworkHistoryComponent,
    SettingsComponent,
    NetworkEndpointComponent,
    BandwidthPipe,
    StorageComponent,
    StorageBlockComponent,
    StorageActionComponent,
    StorageSearchComponent,
    SvgIconComponent,
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
    LogsComponent
  ],
  imports: [
    BrowserModule,
    // disable material animations
    // BrowserAnimationsModule,
    NoopAnimationsModule,

    HttpClientModule,

    // loading routing
    RouterModule.forRoot(AppRouting, {
      useHash: true,
      // preload all modules
      preloadingStrategy: PreloadAllModules
    }),

    // load ngrx module
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionWithinNgZone: true,
        strictStateSerializability: true,
      }
    }),

    // load effect module
    EffectsModule.forRoot([
      AppEffects,
      MonitoringEffects,
      NetworkActionEffects,
      NetworkActionDetailEffects,
      StorageBlockEffects,
      StorageActionEffects,
      StorageSearchEffects,
      EndpointsActionEffects,
      SettingsEffects,
      SettingsNodeEffects,
    ]),

    // https://github.com/zalmoxisus/redux-devtools-extension
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],

    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    // MatCheckboxModule,
    MatChipsModule,
    MatTableModule,
    // MatDatepickerModule,
    // MatDialogModule,
    // MatExpansionModule,
    MatFormFieldModule,
    // MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    // MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    // MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    // MatSlideToggleModule,
    // MatSliderModule,
    MatSnackBarModule,
    // MatSortModule,
    // MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,

    NgxChartsModule,

    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

    NgxJsonViewerModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }