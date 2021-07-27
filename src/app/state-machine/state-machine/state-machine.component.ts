import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { StateMachineActionsLoad, StateMachineActionTypes, StateMachineClose, StateMachineDiagramLoad, StateMachineStateLoad } from './state-machine.actions';
import { selectStateMachine, selectStateMachineState } from '@state-machine/state-machine/state-machine.reducer';
import { Observable } from 'rxjs';
import { StateMachine } from '@shared/types/state-machine/state-machine.type';

@Component({
  selector: 'app-state-machine',
  templateUrl: './state-machine.component.html',
  styleUrls: ['./state-machine.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMachineComponent implements OnInit, OnDestroy {

  readonly tabs = ['HANDSHAKE', 'BOOTSTRAP', 'MEMPOOL'];
  activeTab: string = 'HANDSHAKE';
  state$: Observable<StateMachine>;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.store.dispatch<StateMachineStateLoad>({
      type: StateMachineActionTypes.STATE_MACHINE_STATE_LOAD
    });
    this.store.dispatch<StateMachineDiagramLoad>({
      type: StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD,
      payload: null
    });
    this.store.dispatch<StateMachineActionsLoad>({
      type: StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD
    });

    this.state$ = this.store.select(selectStateMachine);
  }

  ngOnDestroy(): void {
    this.store.dispatch<StateMachineClose>({
      type: StateMachineActionTypes.STATE_MACHINE_CLOSE
    });
  }
}
