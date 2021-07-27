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
import { VirtualScrollDirective } from '@shared/virtual-scroll/virtual-scroll.directive';
import { distinctUntilChanged, filter, mergeMap } from 'rxjs/operators';

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
        mergeMap(state => of(state).pipe(delay(state.collapsedDiagram !== this.collapsedDiagram ? 250 : 0)))
      )
      .subscribe((state: StateMachine) => {
        this.stateMachine = state;
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
      const offsetScrollElements = 5; // same as in vsFor
      if (hoverIndex < offsetScrollElements + 3 && state.actionTable.autoScroll === 'up') {
        this.vsContainer.nativeElement.scrollBy({ top: -150, behavior: 'smooth' });
      } else if (hoverIndex > (this.vsContainer.nativeElement.childElementCount - (this.vsContainer.nativeElement.scrollTop === 0 ? 11 : 6)) && state.actionTable.autoScroll === 'down') {
        this.vsContainer.nativeElement.scrollBy({ top: 150, behavior: 'smooth' });
      } else if (state.actionTable.autoScroll === 'any') {
        this.forceScrollActionIndex = state.activeAction.id;
      }
    }
  }

  getItems(params: { nextCursorId: number }): void {
    this.pausePlaying();
    this.store.dispatch<StateMachineFilterActions>({
      type: StateMachineActionTypes.STATE_MACHINE_ACTIONS_FILTER_LOAD,
      payload: {
        cursor: params.nextCursorId
      }
    });
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

    this.getItems({ nextCursorId: this.pageSize });
  }

  loadLastPage(): void {
    const nextPageId = this.stateMachine.actionTable.pages[this.stateMachine.actionTable.pages.length - 1];

    this.getItems({ nextCursorId: nextPageId });
  }

  loadPreviousPage(): void {
    if (this.stateMachine.actionTable.stream) {
      this.scrollStop();
    }
    const nextCursorId = Math.max(this.stateMachine.actionTable.activePage.start.originalId - 1, this.pageSize);
    this.getItems({ nextCursorId });
  }

  loadNextPage(): void {
    const actualPageIndex = this.stateMachine.actionTable.pages.findIndex(pageId => pageId === this.stateMachine.actionTable.activePage.id);

    if (actualPageIndex === this.stateMachine.actionTable.pages.length - 1) {
      return;
    }

    const nextPageId = this.stateMachine.actionTable.pages[actualPageIndex] + this.pageSize;

    this.getItems({ nextCursorId: nextPageId });
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
