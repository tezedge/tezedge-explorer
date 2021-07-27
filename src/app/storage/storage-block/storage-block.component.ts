import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StorageBlock } from '../../shared/types/storage/storage-block/storage-block.type';
import { selectActiveNode } from '../../settings/settings-node/settings-node.reducer';
import { State } from '../../app.reducers';

@UntilDestroy()
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

  @ViewChild('vsContainer') vsContainer: ElementRef<HTMLDivElement>;

  private isStorageActionFeatureEnabled: boolean;

  constructor(private store: Store<State>,
              private changeDetector: ChangeDetectorRef,
              private router: Router) { }

  ngOnInit() {
    this.store.dispatch({ type: 'STORAGE_BLOCK_RESET' });
    this.scrollStart(null);

    this.store.select('storageBlock')
      .pipe(untilDestroyed(this))
      .subscribe((data: StorageBlock) => {
        this.virtualScrollItems = data;
        this.storageBlockShow = data.ids.length > 0;

        // if (this.storageBlockShow && !this.virtualScrollItems.selected.hash) {
        //   this.getItemDetails(this.virtualScrollItems.entities[this.virtualScrollItems.ids[this.virtualScrollItems.ids.length - 1]]);
        // }

        this.changeDetector.detectChanges();
      });
    this.listenToActiveNode();
  }

  private listenToActiveNode(): void {
    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this))
      .subscribe(node => {
        this.isStorageActionFeatureEnabled = node.features.some(f => f.name === 'storage-action');
      });
  }

  getItemDetails($event): void {
    this.store.dispatch({
      type: 'STORAGE_BLOCK_DETAILS_LOAD',
      payload: {
        hash: $event?.hash,
        context: this.virtualScrollItems.availableContexts[0]
      }
    });
  }

  getDetailsOfPreviousBlock(): void {
    const items = this.virtualScrollItems;
    if (items.selected.hash !== items.entities[0].hash) {
      this.store.dispatch({ type: 'STORAGE_BLOCK_NEIGHBOUR_BLOCK_DETAILS', payload: { neighbourIndex: -1 } });
    }
    const hoverIndex = Array.from(this.vsContainer.nativeElement.children).findIndex(entry => entry.classList.contains('hover'));
    if (hoverIndex < 33) {
      this.vsContainer.nativeElement.scrollBy({ top: -150, behavior: 'smooth' });
    }
  }

  getDetailsOfNextBlock(): void {
    const items = this.virtualScrollItems;
    if (items.selected.hash !== items.entities[items.ids[items.ids.length - 1]].hash) {
      this.store.dispatch({ type: 'STORAGE_BLOCK_NEIGHBOUR_BLOCK_DETAILS', payload: { neighbourIndex: 1 } });
    }
    const hoverIndex = Array.from(this.vsContainer.nativeElement.children).findIndex(entry => entry.classList.contains('hover'));
    if (hoverIndex > (this.vsContainer.nativeElement.childElementCount - 6)) {
      this.vsContainer.nativeElement.scrollBy({ top: 150, behavior: 'smooth' });
    }
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

  goToStorageActions(hash): void {
    if (!hash || !this.isStorageActionFeatureEnabled) {
      return;
    }
    this.router.navigate(['storage', hash]);
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
    this.store.dispatch({ type: 'STORAGE_BLOCK_RESET' });
    this.store.dispatch({ type: 'STORAGE_BLOCK_STOP' });
  }
}
