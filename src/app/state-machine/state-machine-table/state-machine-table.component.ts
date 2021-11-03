import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { selectStateMachine, selectStateMachineDiagramHeight } from '@state-machine/state-machine/state-machine.reducer';
import { StateMachineAction } from '@shared/types/state-machine/state-machine-action.type';
import {
  StateMachineActionsLoad,
  StateMachineActionsStopStream,
  StateMachineActionTypes,
  StateMachineFilterActions,
  StateMachineSetActiveAction,
  StateMachineStopPlaying,
} from '@state-machine/state-machine/state-machine.actions';
import { StateMachine } from '@shared/types/state-machine/state-machine.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { delay, of } from 'rxjs';
import { VIRTUAL_SCROLL_OFFSET_SCROLL_ELEMENTS, VirtualScrollDirective } from '@shared/virtual-scroll/virtual-scroll.directive';
import { distinctUntilChanged, filter, mergeMap, tap } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-state-machine-table',
  templateUrl: './state-machine-table.component.html',
  styleUrls: ['./state-machine-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMachineTableComponent implements OnInit {

  stateMachine: StateMachine;
  pageSize: number;
  forceScrollActionIndex: number;

  @ViewChild('vsContainer') private vsContainer: ElementRef<HTMLDivElement>;
  @ViewChild(VirtualScrollDirective) private vsFor: VirtualScrollDirective;
  private collapsedDiagram: boolean;

  constructor(private zone: NgZone,
              private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.select(selectStateMachine)
      .pipe(
        untilDestroyed(this),
        tap(state => this.stateMachine = state),
        mergeMap(state => of(state).pipe(delay(state.collapsedDiagram !== this.collapsedDiagram ? 250 : 0)))
      )
      .subscribe((state: StateMachine) => {
        this.pageSize = state.actionTable.filter.limit;
        if (state.collapsedDiagram !== this.collapsedDiagram) {
          this.collapsedDiagram = state.collapsedDiagram;
          this.vsFor?.onResize();
        }
        this.scrollToActiveAction(state);
        this.cdRef.detectChanges();
      });

    this.store.select(selectStateMachineDiagramHeight)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        distinctUntilChanged(),
      )
      .subscribe(() => this.vsFor?.onResize());
  }

  private scrollToActiveAction(state: StateMachine): void {
    if (this.vsContainer && state.actionTable.autoScroll) {
      const hoverIndex = Array.from(this.vsContainer.nativeElement.children).findIndex(entry => entry.classList.contains('hover'));
      if (hoverIndex < VIRTUAL_SCROLL_OFFSET_SCROLL_ELEMENTS + 3 && state.actionTable.autoScroll === 'up') {
        this.vsContainer.nativeElement.scrollBy({ top: -150, behavior: 'smooth' });
      } else if (hoverIndex > (this.vsContainer.nativeElement.childElementCount - (this.vsContainer.nativeElement.scrollTop === 0 ? 11 : 6)) && state.actionTable.autoScroll === 'down') {
        this.vsContainer.nativeElement.scrollBy({ top: 150, behavior: 'smooth' });
      } else if (state.actionTable.autoScroll === 'any') {
        this.forceScrollActionIndex = state.activeAction.id;
      }
    }
  }

  startStopDataStream(value: { stop: boolean, limit: number }): void {
    if (value.stop) {
      this.scrollStop();
    } else {
      this.scrollStart();
    }
  }

  scrollStart(): void {
    if (this.stateMachine.actionTable && this.stateMachine.actionTable.stream) {
      return;
    }
    this.pausePlaying();

    this.store.dispatch<StateMachineActionsLoad>({
      type: StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD
    });
  }

  scrollStop(): void {
    if (this.stateMachine.actionTable.stream) {
      this.store.dispatch<StateMachineActionsStopStream>({
        type: StateMachineActionTypes.STATE_MACHINE_ACTIONS_STOP_STEAM
      });
    }
  }

  loadFirstPage(): void {
    if (this.stateMachine.actionTable.stream) {
      this.scrollStop();
    }

    this.getActions(null, true);
  }

  loadLastPage(): void {
    this.getActions(null);
    this.scrollStop();
  }

  loadPreviousPage(): void {
    if (this.stateMachine.actionTable.stream) {
      this.scrollStop();
    }
    const firstActionId = this.stateMachine.actionTable.entities[0].originalId;
    this.getActions(firstActionId);
  }

  loadNextPage(): void {
    const lastActionId = this.stateMachine.actionTable.entities[this.stateMachine.actionTable.ids.length - 1].originalId;
    this.getActions(lastActionId, true);
  }

  private getActions(cursor: string, rev: boolean = false): void {
    this.pausePlaying();
    this.store.dispatch<StateMachineFilterActions>({
      type: StateMachineActionTypes.STATE_MACHINE_ACTIONS_FILTER_LOAD,
      payload: { cursor, rev }
    });
  }

  selectAction(action: StateMachineAction): void {
    if (this.stateMachine.activeAction !== action) {
      this.zone.run(() => {
        this.pausePlaying();
        this.store.dispatch<StateMachineSetActiveAction>({
          type: StateMachineActionTypes.STATE_MACHINE_SET_ACTIVE_ACTION,
          payload: { action }
        });
      });
      this.scrollStop();
    }
  }

  pausePlaying(): void {
    if (this.stateMachine.isPlaying) {
      this.store.dispatch<StateMachineStopPlaying>({ type: StateMachineActionTypes.STATE_MACHINE_PAUSE_PLAYING });
    }
  }
}
