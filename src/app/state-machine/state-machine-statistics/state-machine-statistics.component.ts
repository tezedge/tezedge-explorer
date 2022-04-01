import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { selectStateMachine } from '@state-machine/state-machine/state-machine.reducer';
import { Observable } from 'rxjs';
import { StateMachine } from '@shared/types/state-machine/state-machine.type';

@Component({
  selector: 'app-state-machine-statistics',
  templateUrl: './state-machine-statistics.component.html',
  styleUrls: ['./state-machine-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMachineStatisticsComponent implements OnInit {

  state$: Observable<StateMachine>;

  constructor(private zone: NgZone,
              private store: Store<State>) { }

  ngOnInit(): void {
    this.state$ = this.store.select(selectStateMachine);
  }

}
