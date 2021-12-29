import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import {
  MEMPOOL_BAKING_RIGHTS_INIT,
  MEMPOOL_BAKING_RIGHTS_SORT,
  MEMPOOL_BAKING_RIGHTS_STOP,
  MempoolBakingRightsInit,
  MempoolBakingRightsSort,
  MempoolBakingRightsStop
} from '@mempool/mempool-baking-rights/mempool-baking-rights.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MempoolBakingRightsState } from '@shared/types/mempool/baking-rights/mempool-baking-rights-state.type';
import { mempoolBakingRights } from '@mempool/mempool-baking-rights/mempool-baking-rights.reducer';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ADD_INFO, InfoAdd } from '@shared/error-popup/error-popup.actions';
import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';

@UntilDestroy()
@Component({
  selector: 'app-mempool-baking-rights',
  templateUrl: './mempool-baking-rights.component.html',
  styleUrls: ['./mempool-baking-rights.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolBakingRightsComponent implements OnInit, OnDestroy {

  readonly tableHeads = [
    { name: 'address' },
    { name: 'node id', sort: 'nodeId' },
    { name: 'baker' },
    { name: 'baker priority', sort: 'bakerPriority' },
    { name: 'block hash', sort: 'blockHash' },
    { name: 'delta' },
    { name: 'received time', sort: 'receivedTime' },
    { name: 'prechecked time', sort: 'precheckedTime' },
    { name: 'sent time', sort: 'sentTime' },
  ];
  state: MempoolBakingRightsState;
  currentSort: TableSort;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  readonly trackBakingRight = (index: number, br: MempoolBakingRight) => br.address;

  ngOnInit(): void {
    this.store.dispatch<MempoolBakingRightsInit>({ type: MEMPOOL_BAKING_RIGHTS_INIT });
    this.listenToStateChange();
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === 'ascending' ? 'descending' : 'ascending';
    this.store.dispatch<MempoolBakingRightsSort>({
      type: MEMPOOL_BAKING_RIGHTS_SORT,
      payload: { sortBy, sortDirection }
    });
  }

  copyHashToClipboard(hash: string, event: MouseEvent): void {
    event.stopPropagation();
    this.store.dispatch<InfoAdd>({ type: ADD_INFO, payload: 'Copied to clipboard: ' + hash });
  }

  ngOnDestroy(): void {
    this.store.dispatch<MempoolBakingRightsStop>({ type: MEMPOOL_BAKING_RIGHTS_STOP });
  }

  private listenToStateChange(): void {
    this.store.select(mempoolBakingRights)
      .pipe(untilDestroyed(this))
      .subscribe((state: MempoolBakingRightsState) => {
        this.state = state;
        this.currentSort = state.sort;
        this.cdRef.detectChanges();
      });
  }
}
