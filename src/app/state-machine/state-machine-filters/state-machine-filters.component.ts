import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StateMachineActionTypes, StateMachineFilterActions } from '@state-machine/state-machine/state-machine.actions';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { selectStateMachineStatistics } from '@state-machine/state-machine/state-machine.reducer';
import { MatExpansionPanel } from '@angular/material/expansion';
import { StateMachineActionStatistics } from '@shared/types/state-machine/state-machine-action-statistics.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';

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
    { label: 'Storage' },
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
      .observe(['(min-width: 1500px)', '(min-width: 1200px)', '(min-width: 700px)'])
      .pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value.breakpoints['(min-width: 1500px)']) {
          this.maxVisibleFilters = 5;
        } else if (value.breakpoints['(min-width: 1200px)']) {
          this.maxVisibleFilters = 4;
        } else if (value.breakpoints['(min-width: 700px)']) {
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
