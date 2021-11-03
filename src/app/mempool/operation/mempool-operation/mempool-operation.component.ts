import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { MempoolOperation } from '@shared/types/mempool/operation/mempool-operation.type';
import { Observable, tap } from 'rxjs';
import { selectMempoolOperations } from '@mempool/operation/mempool-operation/mempool-operation.reducer';
import {
  MEMPOOL_OPERATION_LOAD,
  MEMPOOL_OPERATION_STOP,
  MempoolOperationLoad,
  MempoolOperationStop
} from '@mempool/operation/mempool-operation/mempool-operation.actions';

@Component({
  selector: 'app-mempool-operation',
  templateUrl: './mempool-operation.component.html',
  styleUrls: ['./mempool-operation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolOperationComponent implements OnInit, OnDestroy {

  mempoolOperations$: Observable<MempoolOperation[]>;
  mempoolHoveredItem: number;
  mempoolSelectedItem: number;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.store.dispatch<MempoolOperationLoad>({ type: MEMPOOL_OPERATION_LOAD });
    this.mempoolOperations$ = this.store.select(selectMempoolOperations)
      .pipe(
        tap(() => {
          this.mempoolSelectedItem = 0;
          this.mempoolHoveredItem = this.mempoolSelectedItem;
        })
      );
  }

  selectRow(index: number): void {
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
    this.store.dispatch<MempoolOperationStop>({ type: MEMPOOL_OPERATION_STOP });
  }

}
