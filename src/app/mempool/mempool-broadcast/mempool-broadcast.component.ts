import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { MempoolOperation } from '@shared/types/mempool/operation/mempool-operation.type';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { selectMempoolBroadcast } from '@mempool/mempool-broadcast/mempool-broadcast.reducer';
import {
  MEMPOOL_BROADCAST_LOAD,
  MEMPOOL_BROADCAST_STOP,
  MempoolBroadcastLoad,
  MempoolBroadcastStop
} from '@mempool/mempool-broadcast/mempool-broadcast.action';

@Component({
  selector: 'app-mempool-broadcast',
  templateUrl: './mempool-broadcast.component.html',
  styleUrls: ['./mempool-broadcast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolBroadcastComponent implements OnInit, OnDestroy {

  mempoolOperations$: Observable<MempoolOperation[]>;
  mempoolHoveredItem: number;
  mempoolSelectedItem: number;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.store.dispatch<MempoolBroadcastLoad>({ type: MEMPOOL_BROADCAST_LOAD });
    this.mempoolOperations$ = this.store.select(selectMempoolBroadcast)
      .pipe(
        tap(() => {
          this.mempoolSelectedItem = 0;
          this.mempoolHoveredItem = this.mempoolSelectedItem;
        })
      );
  }

  clickWallet(index: number): void {
    this.mempoolSelectedItem = index;
    this.mempoolHoveredItem = this.mempoolSelectedItem;
  }

  onRowEnter(index: number): void {
    this.mempoolHoveredItem = index;
  }

  onRowLeave(): void {
    this.mempoolHoveredItem = this.mempoolSelectedItem;
  }

  ngOnDestroy(): void {
    this.store.dispatch<MempoolBroadcastStop>({ type: MEMPOOL_BROADCAST_STOP });
  }

}
