import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { MONITORING_CLOSE, MONITORING_LOAD, MonitoringClose, MonitoringLoad } from './monitoring.actions';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitoringComponent implements OnInit, OnDestroy {

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.store.dispatch<MonitoringLoad>({ type: MONITORING_LOAD });
  }

  ngOnDestroy(): void {
    this.store.dispatch<MonitoringClose>({ type: MONITORING_CLOSE });
  }

}
