import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit, OnDestroy {

  public onDestroy$ = new Subject();

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit(): void {

    // start ws stream
    this.store.dispatch({
      type: 'MONITORING_LOAD',
    });

  }

  ngOnDestroy() {

    // stop ws stream
    this.store.dispatch({
      type: 'MONITORING_CLOSE',
    });

    // close all observables
    // this.onDestroy$.next();
    // this.onDestroy$.complete();

  }

}
