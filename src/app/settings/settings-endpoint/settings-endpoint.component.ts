import { Component, OnInit, NgModule } from '@angular/core';

import { Store } from '@ngrx/store'
import { of, Subject } from 'rxjs'

import { takeUntil, take } from 'rxjs/operators'

@Component({
  selector: 'app-settings-endpoint',
  templateUrl: './settings-endpoint.component.html',
  styleUrls: ['./settings-endpoint.component.css']
})
export class SettingsEndpointComponent implements OnInit {

  public settingsEndpointInput
  public onDestroy$ = new Subject()

  constructor(
    public store: Store<any>,
  ) {

    // set default value
    this.store.select('settings').pipe(take(1)).subscribe(settings => {
      this.settingsEndpointInput = settings.endpoint;
    })

  }

  ngOnInit() {

    // wait for data changes from redux    
    this.store.select('settings')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(settings => {
        this.settingsEndpointInput = settings.endpoint;
      })

  }

  ngOnDestroy() {

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  // set changed value 
  valueChange(value) {
    this.settingsEndpointInput = value;
  }

  save_endpoint() {
    
    // save and reload ws endpoint
    this.store.dispatch({
      type: 'SETTINGS_ENDPOINT_SAVE', payload: {
        endpoint: this.settingsEndpointInput
      }
    })

  }

}
