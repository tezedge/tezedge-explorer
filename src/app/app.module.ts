import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { reducers, metaReducers } from './app.reducers';
import { environment } from '../environments/environment';

import { AppEffects } from './app.effects';
import { StorageBlockEffects } from './storage/storage-block/storage-block.effects';
import { StorageActionEffects } from './storage/storage-action/storage-action.effects';
import { SettingsEffects } from './settings/settings.effects';

import { NetworkingComponent } from './networking/networking.component';
import { NetworkingPeersComponent } from './networking/networking-peers/networking-peers.component';


import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressBarModule,
  MatSelectModule,
  MatSidenavModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatCardModule,
  // MatCheckboxModule,
  // MatChipsModule,
  // MatDatepickerModule,
  // MatDialogModule,
  // MatExpansionModule,
  // MatGridListModule,
  // MatMenuModule,
  MatPaginatorModule,
  // MatRadioModule,
  // MatSliderModule,
  // MatSlideToggleModule,
  // MatSortModule,
  // MatStepperModule,
} from '@angular/material';
import { NetworkingStatsComponent } from './networking/networking-stats/networking-stats.component';
import { NetworkingHistoryComponent } from './networking/networking-history/networking-history.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsEndpointComponent } from './settings/settings-endpoint/settings-endpoint.component';
import { NetworkingEndpointComponent } from './networking/networking-endpoint/networking-endpoint.component';

// TODO: replace woth reactive forms
import { FormsModule } from '@angular/forms';
import { BandwidthPipe } from './shared/bandwidth.pipe';
import { StorageComponent } from './storage/storage.component';
import { StorageBlockComponent } from './storage/storage-block/storage-block.component';
import { StorageActionComponent } from './storage/storage-action/storage-action.component';
import { StorageSearchComponent } from './storage/storage-search/storage-search.component'


@NgModule({
  declarations: [
    AppComponent,
    NetworkingComponent,
    NetworkingPeersComponent,
    NetworkingStatsComponent,
    NetworkingHistoryComponent,
    SettingsComponent,
    SettingsEndpointComponent,
    NetworkingEndpointComponent,
    BandwidthPipe,
    StorageComponent,
    StorageBlockComponent,
    StorageActionComponent,
    StorageSearchComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
        strictActionImmutability: true
      }
    }),

    // load effect module
    EffectsModule.forRoot([
      AppEffects,
      StorageBlockEffects,
      StorageActionEffects,
      SettingsEffects,
    ]),

    // https://github.com/zalmoxisus/redux-devtools-extension
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 10 }) : [],

    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    // MatCheckboxModule,
    // MatChipsModule,
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
    // MatSelectModule,
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

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }