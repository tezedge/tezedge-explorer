import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store<any>,
  ) { }

  ngOnInit(): void {
    this.store.dispatch({
      type: 'MONITORING_LOAD',
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch({
      type: 'MONITORING_CLOSE',
    });
  }

}
