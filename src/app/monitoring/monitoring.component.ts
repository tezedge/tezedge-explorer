import { Component, OnDestroy, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';

@UntilDestroy()
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
    this.initMonitoring();
  }

  private initMonitoring(): void {
    this.store.pipe(
      untilDestroyed(this),
      select(state => state.settingsNode.activeNode),
      filter(api => api.connected)
    ).subscribe(() => this.store.dispatch({ type: 'MONITORING_LOAD' }));
  }

  ngOnDestroy(): void {
    this.store.dispatch({ type: 'MONITORING_CLOSE' });
  }

}
