import {Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, NgZone, ChangeDetectorRef} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {VirtualScrollDirective} from '../../shared/virtual-scroll.directive';

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
    this.store.dispatch({type: 'STORAGE_BLOCK_RESET'});

    this.scrollStart(null);

    this.store.select('storageBlock')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log(data);
        this.virtualScrollItems = data;
        this.storageBlockShow = data.ids.length > 0;

        // if (this.storageBlockShow && !this.virtualScrollItems.selected.hash) {
        //   this.getItemDetails(this.virtualScrollItems.entities[this.virtualScrollItems.ids[this.virtualScrollItems.ids.length - 1]]);
        // }

        this.changeDetector.markForCheck();
      });

  }

  getItemDetails($event) {
    this.store.dispatch({
      type: 'STORAGE_BLOCK_DETAILS_LOAD',
      payload: {
        hash: $event?.hash
      }
    });
  }

  getItems($event) {
    this.store.dispatch({
      type: 'STORAGE_BLOCK_FETCH',
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

  ngOnDestroy() {
    // stop streaming actions
    this.store.dispatch({
      type: 'STORAGE_BLOCK_STOP'
    });
    this.store.dispatch({type: 'STORAGE_BLOCK_RESET'});

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
