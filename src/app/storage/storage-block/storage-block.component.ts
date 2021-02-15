import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VirtualScrollDirective } from '../../shared/virtual-scroll.directive';

@Component({
  selector: 'app-storage-block',
  templateUrl: './storage-block.component.html',
  styleUrls: ['./storage-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageBlockComponent implements OnInit, OnDestroy {

  virtualScrollItems;
  storageBlockShow: boolean;
  storageBlockItem;
  filtersState = {
    open: false,
    availableFields: []
  };

  onDestroy$ = new Subject();

  @ViewChild(VirtualScrollDirective) vrFor: VirtualScrollDirective;

  // @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    public store: Store<any>,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.scrollStart(null);

    this.store.select('storageBlock')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.virtualScrollItems = data;
        this.storageBlockShow = data.ids.length > 0;

        if (this.storageBlockShow && !this.storageBlockItem) {
          this.tableMouseEnter(this.virtualScrollItems.entities[this.virtualScrollItems.ids[this.virtualScrollItems.ids.length - 1]]);
        }

        this.changeDetector.markForCheck();

        // setTimeout(() => {
        //   if (this.virtualScrollItems.ids.length > 0 && this.vrFor) {
        //     this.vrFor.afterReceivingData();
        //   }
        // });
      });

  }

  getItems($event) {
    this.store.dispatch({
      type: 'STORAGE_BLOCK_LOAD',
      payload: {
        cursor_id: $event?.nextCursorId,
        limit: $event?.limit
      }
    });
  }

  startStopDataStream(event) {
    if (event.stop) {
      this.scrollStop();
    } else {
      this.scrollStart(event);
    }
  }

  scrollStart($event) {
    if (this.virtualScrollItems && this.virtualScrollItems.stream) {
      return;
    }

    this.store.dispatch({
      type: 'STORAGE_BLOCK_START',
      payload: {
        limit: $event?.limit ? $event.limit : 60
      }
    });
  }

  scrollStop() {
    if (!this.virtualScrollItems.stream) {
      return;
    }

    this.store.dispatch({
      type: 'STORAGE_BLOCK_STOP'
    });
  }

  scrollToEnd() {
    this.vrFor.scrollToBottom();
  }

  tableMouseEnter(item) {
    this.ngZone.runOutsideAngular(() => {
      // check by hash because the id is not present on this.storageBlockItem
      if (this.storageBlockItem && this.storageBlockItem.hash === item.hash) {
        return;
      }

      this.ngZone.run(() => {
        this.storageBlockItem = { ...item };
        // id and index are information not needed for user
        delete this.storageBlockItem.id;
        delete this.storageBlockItem.index;
      });
    });
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
