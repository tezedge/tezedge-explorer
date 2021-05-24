import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UntilDestroy } from '@ngneat/until-destroy';
import { State } from '../app.reducers';

@UntilDestroy()
@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store<State>,
  ) { }

  ngOnInit(): void {
    this.initMonitoring();
  }

  private initMonitoring(): void {
    this.store.dispatch({ type: 'MONITORING_LOAD' });
  }

  ngOnDestroy(): void {
    this.store.dispatch({ type: 'MONITORING_CLOSE' });
  }

}
