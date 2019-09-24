import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { NetworkingComponent } from './networking/networking.component';


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
    })

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }