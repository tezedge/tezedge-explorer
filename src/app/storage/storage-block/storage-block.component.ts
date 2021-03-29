import {Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, NgZone, ChangeDetectorRef} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {VirtualScrollDirective} from '../../shared/virtual-scroll/virtual-scroll.directive';
import {StorageBlock} from '../../shared/types/storage/storage-block.type';

@Component({
  selector: 'app-storage-block',
  templateUrl: './storage-block.component.html',
  styleUrls: ['./storage-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageBlockComponent implements OnInit, OnDestroy {

  virtualScrollItems: StorageBlock;
  storageBlockShow: boolean;
  filtersState = {
    open: false
  };
  virtualPageSize = 1000;

  onDestroy$ = new Subject();

  @ViewChild(VirtualScrollDirective) vrFor: VirtualScrollDirective;

  constructor(
    public store: Store<any>,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.store.dispatch({type: 'STORAGE_BLOCK_RESET'});
    this.scrollStart(null);

    this.store.select('storageBlock')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: StorageBlock) => {
        this.virtualScrollItems = data;
        this.storageBlockShow = data.ids.length > 0;

        // if (this.storageBlockShow && !this.virtualScrollItems.selected.hash) {
        //   this.getItemDetails(this.virtualScrollItems.entities[this.virtualScrollItems.ids[this.virtualScrollItems.ids.length - 1]]);
        // }

        this.changeDetector.markForCheck();
      });

  }

  getItemDetails($event): void {
    this.store.dispatch({
      type: 'STORAGE_BLOCK_DETAILS_LOAD',
      payload: {
        hash: $event?.hash
      }
    });
  }

  getItems($event): void {
    this.store.dispatch({
      type: 'STORAGE_BLOCK_FETCH',
      payload: {
        cursor_id: $event?.nextCursorId,
        limit: $event?.limit
      }
    });
  }

  loadPreviousPage(): void {
    if (this.virtualScrollItems.stream) {
      this.scrollStop();
    }
    this.getItems({
      nextCursorId: this.virtualScrollItems.activePage.start.originalId,
      limit: this.virtualPageSize
    });
  }

  loadNextPage(): void {
    const actualPageIndex = this.virtualScrollItems.pages.findIndex(pageId => Number(pageId) === this.virtualScrollItems.activePage.id);

    if (actualPageIndex === this.virtualScrollItems.pages.length - 1) {
      return;
    }

    const nextPageId = this.virtualScrollItems.pages[actualPageIndex + 1];

    this.getItems({
      nextCursorId: nextPageId,
      limit: this.virtualPageSize
    });
  }

  startStopDataStream(event): void {
    if (event.stop) {
      this.scrollStop();
    } else {
      this.scrollStart(event);
    }
  }

  scrollStart($event): void {
    if (this.virtualScrollItems && this.virtualScrollItems.stream) {
      return;
    }

    this.store.dispatch({
      type: 'STORAGE_BLOCK_START',
      payload: {
        limit: $event?.limit ? $event.limit : this.virtualPageSize
      }
    });
  }

  scrollStop(): void {
    if (!this.virtualScrollItems.stream) {
      return;
    }

    this.store.dispatch({
      type: 'STORAGE_BLOCK_STOP'
    });
  }

  scrollToEnd(): void {
    this.scrollStart(null);
  }

  // tableMouseEnter(item) {
  //   this.ngZone.runOutsideAngular(() => {
  //     // check by hash because the id is not present on this.storageBlockItem
  //     if (this.storageBlockItem && this.storageBlockItem.hash === item.hash) {
  //       return;
  //     }
  //
  //     this.ngZone.run(() => {
  //       this.storageBlockItem = {...item};
  //     });
  //   });
  // }

  ngOnDestroy(): void {
    // stop streaming actions
    // this.store.dispatch({
    //   type: 'STORAGE_BLOCK_STOP'
    // });
    this.store.dispatch({type: 'STORAGE_BLOCK_RESET'});

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
