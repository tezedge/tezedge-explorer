import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { MonitoringActionTypes } from './monitoring.actions';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitoringComponent implements OnInit, OnDestroy {

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.initMonitoring();
  }

  private initMonitoring(): void {
    this.store.dispatch({ type: MonitoringActionTypes.MONITORING_LOAD });
  }

  ngOnDestroy(): void {
    this.store.dispatch({ type: MonitoringActionTypes.MONITORING_CLOSE });
  }

}
