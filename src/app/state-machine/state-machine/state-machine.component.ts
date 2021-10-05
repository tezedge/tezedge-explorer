import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import {
  StateMachineActionsLoad,
  StateMachineActionTypes,
  StateMachineClose,
  StateMachineDiagramLoad,
  StateMachineResizeDiagram
} from './state-machine.actions';
import { selectStateMachine } from '@state-machine/state-machine/state-machine.reducer';
import { Observable } from 'rxjs';
import { StateMachine } from '@shared/types/state-machine/state-machine.type';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { ResizeDirective } from '@shared/directives/resize.directive';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
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
  transition: string = '';

  private resizeDirective: ResizeDirective;

  @ViewChild(ResizeDirective) set content(content) {
    if (content) {
      this.resizeDirective = content;
    }
  }

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  collapsedDiagram: boolean;

  ngOnInit(): void {
    this.store.dispatch<StateMachineDiagramLoad>({
      type: StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD,
      payload: null
    });
    this.store.dispatch<StateMachineActionsLoad>({
      type: StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD
    });

    this.state$ = this.store.select(selectStateMachine);

    this.store.select(selectStateMachine)
      .pipe(
        untilDestroyed(this),
        map(state => state.collapsedDiagram),
        distinctUntilChanged(),
        tap(collapsedDiagram => {
          if (collapsedDiagram !== this.collapsedDiagram) {
            this.collapsedDiagram = collapsedDiagram;
            if (this.collapsedDiagram) {
              this.transition = 'ease 0.2s';
              this.cdRef.detectChanges();
            } else {
              setTimeout(() => {
                this.transition = '';
                this.resizeDirective.calculateHeight();
                this.cdRef.detectChanges();
              }, 400);
            }
          }
        })
      )
      .subscribe();
  }

  onResizeFinished(height: number): void {
    this.store.dispatch<StateMachineResizeDiagram>({
      type: StateMachineActionTypes.STATE_MACHINE_RESIZE_DIAGRAM,
      payload: height
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch<StateMachineClose>({
      type: StateMachineActionTypes.STATE_MACHINE_CLOSE
    });
  }
}
