import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { reducers, metaReducers } from './reducers';

import { AppEffects } from './app.effects'

import { NetworkingComponent } from './networking/networking.component';

import { environment } from '../environments/environment';


const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent,
    NetworkingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    // loading routing  
    RouterModule.forRoot(AppRouting, {
      // useHash:true
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
    ]),

    // https://github.com/zalmoxisus/redux-devtools-extension
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 25 }) : [],

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }