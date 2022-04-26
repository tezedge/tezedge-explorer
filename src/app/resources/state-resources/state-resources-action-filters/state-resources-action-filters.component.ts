import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import {
  STATE_RESOURCES_GROUP_FILTER,
  STATE_RESOURCES_SORT,
  StateResourcesGroupFilter,
  StateResourcesSorting
} from '@resources/state-resources/state-resources/state-resources.actions';
import { debounceTime } from 'rxjs';
import { MempoolEndorsementSort } from '@shared/types/mempool/endorsement/mempool-endorsement-sort.type';
import { selectStateResourcesSort } from '@resources/state-resources/state-resources/state-resources.index';
import { SortDirection } from '@shared/types/shared/table-sort.type';

@UntilDestroy()
@Component({
  selector: 'app-state-resources-action-filters',
  templateUrl: './state-resources-action-filters.component.html',
  styleUrls: ['./state-resources-action-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateResourcesActionFiltersComponent implements OnInit {

  readonly sortingOptions = [
    { name: 'Total', sort: 'totalTime' },
    { name: 'Mean', sort: 'meanTime' },
    { name: 'Calls', sort: 'count' }
  ];

  formGroup: FormGroup;
  currentSort: MempoolEndorsementSort;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.listenToSorting();
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      search: new FormControl()
    });
    this.formGroup.get('search').valueChanges.pipe(
      untilDestroyed(this),
      distinctUntilChanged(),
      debounceTime(100),
      filter(value => {
        if (value.length > 1) {
          return true;
        } else {
          this.store.dispatch<StateResourcesGroupFilter>({ type: STATE_RESOURCES_GROUP_FILTER, payload: null });
          return false;
        }
      })
    ).subscribe((value: string) => {
      this.store.dispatch<StateResourcesGroupFilter>({ type: STATE_RESOURCES_GROUP_FILTER, payload: value.toLowerCase() });
    });
  }

  private listenToSorting(): void {
    this.store.select(selectStateResourcesSort)
      .pipe(untilDestroyed(this))
      .subscribe(sort => {
        this.currentSort = sort;
        this.cdRef.detectChanges();
      });
  }

  sort(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.store.dispatch<StateResourcesSorting>({
      type: STATE_RESOURCES_SORT,
      payload: {
        sortBy,
        sortDirection
      }
    });
  }
}
