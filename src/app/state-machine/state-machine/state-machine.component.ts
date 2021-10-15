import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import {
  StateMachineActionsLoad, StateMachineActionStatisticsLoad,
  StateMachineActionTypes,
  StateMachineClose,
  StateMachineDiagramLoad,
  StateMachineFilterActions,
  StateMachineResizeDiagram
} from './state-machine.actions';
import { selectStateMachine } from '@state-machine/state-machine/state-machine.reducer';
import { Observable } from 'rxjs';
import { StateMachine } from '@shared/types/state-machine/state-machine.type';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ResizeDirective } from '@shared/directives/resize.directive';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ResourceStorageQueryDetails } from '@shared/types/resources/storage/storage-resource-operation-usage-entry.type';
import { TemplatePortal } from '@angular/cdk/portal';
import { StateMachineActionTypeStatistics } from '@shared/types/state-machine/state-machine-action-type-statistics.type';

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
  activeFilters = [];

  private resizeDirective: ResizeDirective;
  private overlayRef: OverlayRef;

  @ViewChild(ResizeDirective) set content(content) {
    if (content) {
      this.resizeDirective = content;
    }
  }

  @ViewChild('tooltipTemplate') private tooltipTemplate: TemplateRef<any>;

  constructor(private zone: NgZone,
              private overlay: Overlay,
              private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private viewContainerRef: ViewContainerRef) { }

  collapsedDiagram: boolean;
  ySteps = ['10m', '1m', '100k', '10k', '1k', '100', '10', '0'];

  ngOnInit(): void {
    this.store.dispatch<StateMachineDiagramLoad>({
      type: StateMachineActionTypes.STATE_MACHINE_DIAGRAM_LOAD
    });
    this.store.dispatch<StateMachineActionStatisticsLoad>({
      type: StateMachineActionTypes.STATE_MACHINE_ACTION_STATISTICS_LOAD
    });
    this.store.dispatch<StateMachineActionsLoad>({
      type: StateMachineActionTypes.STATE_MACHINE_ACTIONS_LOAD
    });

    this.state$ = this.store.select(selectStateMachine);

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

  filterByType(type: string): void {
    if (this.activeFilters.includes(type)) {
      this.activeFilters = this.activeFilters.filter(f => f !== type);
    } else {
      this.activeFilters = [...this.activeFilters, type];
    }
    this.store.dispatch<StateMachineFilterActions>({
      type: StateMachineActionTypes.STATE_MACHINE_ACTIONS_FILTER_LOAD,
      payload: {
        queryFilters: this.activeFilters
      }
    });
  }

  openDetailsOverlay(column: StateMachineActionTypeStatistics, index: number, event: MouseEvent): void {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }

    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(event.target as HTMLElement)
        .withPositions([{
          originX: 'center',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: 0,
          offsetY: 10
        }])
    });

    event.stopPropagation();
    const context = this.tooltipTemplate
      .createEmbeddedView({
        name: column.kind,
        calls: column.calls,
        duration: column.duration
      })
      .context;
    const portal = new TemplatePortal(this.tooltipTemplate, this.viewContainerRef, context);
    this.overlayRef.attach(portal);
  }

  detachOverlay(): void {
    this.overlayRef.detach();
  }

  ngOnDestroy(): void {
    this.store.dispatch<StateMachineClose>({
      type: StateMachineActionTypes.STATE_MACHINE_CLOSE
    });
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }
}
