import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '@app/app.index';
import {
  STATE_RESOURCES_CLOSE,
  STATE_RESOURCES_LOAD,
  STATE_RESOURCES_NODE_LIFETIME_DATA,
  StateResourcesClose,
  StateResourcesLoad,
  StateResourcesNodeLifetimeData
} from '@resources/state-resources/state-resources/state-resources.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { selectStateResources, StateResourcesState } from '@resources/state-resources/state-resources/state-resources.index';
import { StateResourcesActionGroup } from '@shared/types/resources/state/state-resources-action-group.type';
import { Router } from '@angular/router';
import { selectNetworkLastAppliedBlockLevel } from '@monitoring/network-stats/network-stats.reducer';

@UntilDestroy()
@Component({
  selector: 'app-state-resources',
  templateUrl: './state-resources.component.html',
  styleUrls: ['./state-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateResourcesComponent implements OnInit, OnDestroy {

  state: StateResourcesState;
  expandedPanel: boolean = true;

  private lastAppliedBlock: number;

  constructor(private store: Store<State>,
              private router: Router,
              private cdRef: ChangeDetectorRef) { }

  readonly trackGroups = (index: number, group: StateResourcesActionGroup) => group.groupName;

  ngOnInit(): void {
    this.listenToStateChange();
    this.listenToLastBlockChange();
    this.store.dispatch<StateResourcesLoad>({ type: STATE_RESOURCES_LOAD });
  }

  private listenToStateChange(): void {
    this.store.pipe(
      untilDestroyed(this),
      select(selectStateResources),
      filter(value => value.groups.length > 0),
    ).subscribe(state => {
      this.state = state;
      this.cdRef.detectChanges();
    });
  }

  private listenToLastBlockChange(): void {
    this.store.select(selectNetworkLastAppliedBlockLevel).pipe(
      untilDestroyed(this),
      filter(Boolean),
      distinctUntilChanged()
    ).subscribe((currentBlock: number) => {
      this.lastAppliedBlock = currentBlock;
    });
  }

  togglePanel(): void {
    this.expandedPanel = !this.expandedPanel;
  }

  getNodeLifetimeStats(): void {
    this.router.navigate(['resources', 'state']);
    this.store.dispatch<StateResourcesNodeLifetimeData>({ type: STATE_RESOURCES_NODE_LIFETIME_DATA });
  }

  getLatestBlockStats(): void {
    this.router.navigate(['resources', 'state', this.lastAppliedBlock, 0]);
  }

  ngOnDestroy(): void {
    this.store.dispatch<StateResourcesClose>({ type: STATE_RESOURCES_CLOSE });
  }
}
