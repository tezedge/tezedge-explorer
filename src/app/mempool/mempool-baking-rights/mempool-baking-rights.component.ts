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
import { mempoolBakingRightsState } from '@mempool/mempool-baking-rights/mempool-baking-rights.reducer';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { ADD_INFO, InfoAdd } from '@shared/components/error-popup/error-popup.actions';
import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';
import { refreshBlock } from '@shared/constants/animations';
import { selectNetworkCurrentBlock } from '@network/network-stats/network-stats.reducer';
import { distinctUntilChanged, filter } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-mempool-baking-rights',
  templateUrl: './mempool-baking-rights.component.html',
  styleUrls: ['./mempool-baking-rights.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 overflow-auto d-block' },
  animations: [refreshBlock]
})
export class MempoolBakingRightsComponent implements OnInit, OnDestroy {

  readonly tableHeads = [
    { name: 'address' },
    { name: 'node id', sort: 'nodeId' },
    { name: 'block hash', sort: 'blockHash' },
    { name: 'received', sort: 'receivedTime' },
    { name: 'sent', sort: 'sentTime' },
    { name: 'get op. recv start', sort: 'getOperationsRecvStartTime' },
    { name: 'get op. recv end', sort: 'getOperationsRecvEndTime' },
    { name: 'op. send start', sort: 'operationsSendStartTime' },
    { name: 'op. send end', sort: 'operationsSendEndTime' },
    { name: 'response rate', sort: 'responseRate' },
  ];
  readonly FIFTY_MS = 50000000;
  readonly TWENTY_MS = 20000000;

  state: MempoolBakingRightsState;
  currentSort: TableSort;
  currentBlock: number;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  readonly trackBakingRight = (index: number, br: MempoolBakingRight) => br.address;

  ngOnInit(): void {
    this.store.dispatch<MempoolBakingRightsInit>({ type: MEMPOOL_BAKING_RIGHTS_INIT });
    this.listenToStateChange();
    this.listenToBlockChange();
  }

  private listenToBlockChange(): void {
    this.store.select(selectNetworkCurrentBlock).pipe(
      untilDestroyed(this),
      filter(Boolean),
      distinctUntilChanged()
    ).subscribe((currentBlock: number) => this.currentBlock = currentBlock);
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
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
    this.store.select(mempoolBakingRightsState)
      .pipe(untilDestroyed(this))
      .subscribe((state: MempoolBakingRightsState) => {
        this.state = state;
        this.currentSort = state.sort;
        this.cdRef.detectChanges();
      });
  }
}
