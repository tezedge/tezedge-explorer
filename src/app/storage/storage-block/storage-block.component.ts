import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-storage-block',
  templateUrl: './storage-block.component.html',
  styleUrls: ['./storage-block.component.scss']
})
export class StorageBlockComponent implements OnInit, OnDestroy {

  virtualScrollItems;
  storageBlockList;
  storageBlockShow;
  storageBlockItem;

  onDestroy$ = new Subject();

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {

    this.store.select('storageBlock')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.virtualScrollItems = data;
        this.storageBlockShow = data.ids.length > 0;
        // this.storageBlockList = data.ids.map(id => ({ id, ...data.entities[id] }));

        // set viewport at the end
        // if (this.storageBlockShow) {
        //
        //   this.tableDataSource = new MatTableDataSource<any>(this.storageBlockList);
        //   this.tableDataSource.paginator = this.paginator;
        //
        //   const viewPortRange = this.viewPort && this.viewPort.getRenderedRange() ?
        //     this.viewPort.getRenderedRange() : { start: 0, end: 0 };
        //   const viewPortItemLength = this.storageBlockList.length;
        //
        //   // trigger only if we are streaming and not at the end of page
        //   if (data.stream && viewPortItemLength > 0 && (viewPortRange.end !== viewPortItemLength) &&
        //     (viewPortRange.start !== viewPortRange.end)) {
        //
        //     setTimeout(() => {
        //       const offset = this.ITEM_SIZE * this.storageBlockList.length;
        //       this.viewPort.scrollToOffset(offset);
        //     });
        //
        //   }
        //
        // }

      });

    // triger action and get blocks data
    this.store.dispatch({
      type: 'STORAGE_BLOCK_LOAD',
    });

  }

  onScroll(index) {

    if (this.storageBlockList.length - index > 15) {
      // stop log actions stream
      this.store.dispatch({
        type: 'STORAGE_BLOCK_STOP',
        payload: event,
      });
    } else {
      // start log actions stream
      this.store.dispatch({
        type: 'STORAGE_BLOCK_START',
        payload: event,
      });
    }

  }

  scrollStart() {

    // triger action and get block data
    this.store.dispatch({
      type: 'STORAGE_BLOCK_START'
    });

  }

  scrollStop() {

    // stop streaming actions
    this.store.dispatch({
      type: 'STORAGE_BLOCK_STOP'
    });

  }

  scrollToEnd() {
  }

  tableMouseEnter(item) {

    this.storageBlockItem = item;

  }

  ngOnDestroy() {
    // stop streaming actions
    this.store.dispatch({
      type: 'STORAGE_BLOCK_STOP'
    });

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
