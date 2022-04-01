import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StateMachineActionTypes, StateMachineFilterActions } from '@state-machine/state-machine/state-machine.actions';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { selectStateMachineStatistics } from '@state-machine/state-machine/state-machine.reducer';
import { MatExpansionPanel } from '@angular/material/expansion';
import { StateMachineActionStatistics } from '@shared/types/state-machine/state-machine-action-statistics.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MIN_WIDTH_1200, MIN_WIDTH_1500, MIN_WIDTH_700 } from '@shared/constants/breakpoint-observer';

interface FilterCategory {
  label: string;
  filters?: string[];
}

@UntilDestroy()
@Component({
  selector: 'app-state-machine-filters',
  templateUrl: './state-machine-filters.component.html',
  styleUrls: ['./state-machine-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [MatExpansionPanel]
})
export class StateMachineFiltersComponent implements OnInit {

  activeFilters = [];
  accordionExpanded: boolean;
  maxVisibleFilters = 5;
  categories: FilterCategory[] = [
    { label: 'P2p' },
    { label: 'PeerHandshaking' },
    { label: 'PeerConnection' },
    { label: 'PeerMessage' },
    { label: 'PeerBinary' },
    { label: 'PeerChunk' },
    { label: 'PeerTry' },
    { label: 'PeersDns' },
    { label: 'PeersCheck' },
    { label: 'PeersGraylist' },
    { label: 'Storage' },
    { label: 'YieldedOperations' },
    { label: 'PausedLoops' },
    { label: 'Others' },
  ];

  constructor(private store: Store<State>,
              private breakpointObserver: BreakpointObserver,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listenToStatisticsChange();
    this.listenToWindowResize();
  }

  private listenToStatisticsChange(): void {
    this.store.select(selectStateMachineStatistics)
      .pipe(
        untilDestroyed(this),
        filter(s => s.statistics.length > 0)
      )
      .subscribe((stats: StateMachineActionStatistics) => {
        let statsArray = stats.statistics.map(a => a.kind);
        this.categories.forEach((category, i) => {
          this.categories[i].filters = statsArray.filter(a => a.startsWith(category.label));
          statsArray = statsArray.filter(a => !a.startsWith(category.label));
        });
        this.categories[this.categories.length - 1].filters = statsArray;
        this.categories = this.categories.filter(c => c.filters.length);
        this.cdRef.detectChanges();
      });
  }

  private listenToWindowResize(): void {
    this.breakpointObserver
      .observe([MIN_WIDTH_1500, MIN_WIDTH_1200, MIN_WIDTH_700])
      .pipe(untilDestroyed(this))
      .subscribe((value: BreakpointState) => {
        if (value.breakpoints[MIN_WIDTH_1500]) {
          this.maxVisibleFilters = 5;
        } else if (value.breakpoints[MIN_WIDTH_1200]) {
          this.maxVisibleFilters = 4;
        } else if (value.breakpoints[MIN_WIDTH_700]) {
          this.maxVisibleFilters = 2;
        } else {
          this.maxVisibleFilters = 1;
        }
        this.cdRef.detectChanges();
      });
  }

  filterByType(type: string): void {
    if (this.activeFilters.includes(type)) {
      this.activeFilters = this.activeFilters.filter(f => f !== type);
    } else {
      this.activeFilters = [...this.activeFilters, type];
    }
    this.cdRef.detectChanges();
    this.store.dispatch<StateMachineFilterActions>({
      type: StateMachineActionTypes.STATE_MACHINE_ACTIONS_FILTER_LOAD,
      payload: {
        queryFilters: this.activeFilters
      }
    });
  }
}
