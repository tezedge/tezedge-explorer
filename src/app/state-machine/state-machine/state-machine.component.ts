import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import {
  StateMachineActionsLoad,
  StateMachineActionStatisticsLoad,
  StateMachineActionTypes,
  StateMachineClose,
  StateMachineDiagramLoad,
  StateMachineResizeDiagram
} from './state-machine.actions';
import { selectStateMachine } from '@state-machine/state-machine/state-machine.reducer';
import { Observable } from 'rxjs';
import { StateMachine } from '@shared/types/state-machine/state-machine.type';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ResizeDirective } from '@shared/directives/resize.directive';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-state-machine',
  templateUrl: './state-machine.component.html',
  styleUrls: ['./state-machine.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMachineComponent implements OnInit, AfterViewInit, OnDestroy {

  state$: Observable<StateMachine>;
  transition: string = '';

  private resizeDirective: ResizeDirective;
  private collapsedDiagram: boolean;

  @ViewChild(ResizeDirective) set content(content) {
    if (content) {
      this.resizeDirective = content;
    }
  }

  constructor(private zone: NgZone,
              private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.state$ = this.store.select(selectStateMachine);

    this.store.dispatch<StateMachineDiagramLoad>({
      type: StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD
    });
    this.store.dispatch<StateMachineActionStatisticsLoad>({
      type: StateMachineActionTypes.STATE_MACHINE_ACTION_STATISTICS_LOAD
    });
    this.store.dispatch<StateMachineActionsLoad>({
      type: StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD
    });
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() =>
      this.state$.pipe(
        untilDestroyed(this),
        map(state => state.collapsedDiagram),
        distinctUntilChanged()
      ).subscribe(collapsedDiagram => {
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
    );
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
