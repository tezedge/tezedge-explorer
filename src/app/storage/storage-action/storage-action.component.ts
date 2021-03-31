import {Component, OnInit, ViewChild, NgZone, ChangeDetectorRef, OnDestroy} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import { VirtualScrollFromTopDirective } from '../../shared/virtual-scroll/virtual-scroll-from-top.directive';

@Component({
  selector: 'app-storage-action',
  templateUrl: './storage-action.component.html',
  styleUrls: ['./storage-action.component.scss']
})

export class StorageActionComponent implements OnInit, OnDestroy {
  virtualScrollItems;
  storageActionShow: boolean;
  storageActionItem;
  filtersState = {
    open: false
  };
  block: string;
  viewLast = 'block';

  onDestroy$ = new Subject();

  // public search;
  // public block;
  // public blockHash;
  // public addressHash;
  // public storageBlock;
  // public storageAction;
  // public storageActionBlocks;
  // public storageActionDetail = false;
  // public tableDataSource = [];
  public routerParams;
  // public viewChange = false;
  // public viewLast;
  // public filters = ['SET'];
  // public expandedElement;
  // public onDestroy$ = new Subject();


  @ViewChild(VirtualScrollFromTopDirective) vrFor: VirtualScrollFromTopDirective;

  constructor(
    public store: Store<any>,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    // wait for data changes from redux
    this.store.select('storageAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.virtualScrollItems = data;
        this.storageActionShow = data.ids.length > 0;

        // if (this.storageActionShow && !this.storageActionItem) {
        //   // this.tableMouseEnter(this.virtualScrollItems.entities[this.virtualScrollItems.ids[this.virtualScrollItems.ids.length - 1]]);
        // }

        this.changeDetector.markForCheck();
        // return;

        // this.storageAction = data;
        // this.storageActionShow = data.entities.length > 0;

        // save view change
        // this.viewChange = this.viewLast !== data.view;
        // this.viewLast = data.view;
        //
        // // chnage data only after view change
        // if (this.viewChange) {
        //
        //   // clean up tableData Source
        //   this.tableDataSource = [];
        //   this.storageActionBlocks = data.blocks;
        //   this.storageActionBlocks.map(block => {
        //
        //     const tableData = data.ids[block].map(id => ({...data.entities[id]}));
        //     this.tableDataSource[block] = new MatTableDataSource<any>(tableData);
        //
        //   });
        // }

      });

    // TODO: uncomment and refactor

    // get url params
    // TODO: unsubscribe after destroy
    this.routerParams = this.route.params.subscribe(params => {
      this.block = params['search'];
      // move to scroll
      // window.scrollTo(0, 0);
      //
      // // console.log('[storage][actions]', params, params['search']);
      //
      // // process block ID
      const blockPrefix = params['search'].substr(0, 1);
      if (blockPrefix === 'B') {

        this.getActionDetails();

        // triger action and get blocks data
        this.store.dispatch({
          type: 'STORAGE_BLOCK_ACTION_LOAD',
          payload: {
            blockHash: this.block
          }
        });

      }

      // // porcess address id
      // const addressPrefix = params['search'].substr(0, 3);
      // if (addressPrefix === 'tz1' || addressPrefix === 'tz2' || addressPrefix === 'tz3' || addressPrefix === 'KT1') {
      //
      //   // triger action and get blocks data
      //   this.store.dispatch({
      //     type: 'STORAGE_ADDRESS_ACTION_LOAD',
      //     payload: {
      //       addressHash: params['search']
      //     }
      //   });
      //
      // }

    });


  }

  getItems($event) {
    this.store.dispatch({
      type: 'STORAGE_BLOCK_ACTION_LOAD',
      payload: {
        cursor_id: $event?.nextCursorId,
        limit: $event?.limit,
        blockHash: this.block
      }
    });
  }

  getActionDetails() {
    this.store.dispatch({
      type: 'STORAGE_BLOCK_ACTION_DETAILS_LOAD',
      payload: {
        blockHash: this.block
      }
    });
  }

  startStopDataStream(event) {
    return;
  }

  scrollToEnd() {
    this.vrFor.scrollToTop();
  }

  tableMouseEnter(item) {
    this.ngZone.runOutsideAngular(() => {
      if (this.storageActionItem && this.storageActionItem.id === item.id) {
        return;
      }

      this.ngZone.run(() => {
        const value = this.formatHexValues(item.value);
        this.storageActionItem = {
          ...item,
          value
        };
      });
    });
  }

  private formatHexValues(bytes): string[][] {
    if (!bytes || !bytes.length) {
      return [];
    }

    let row = [];
    const hexArray = [];

    bytes.forEach((byte, index) => {
      if (index % 16 === 0 && index > 0) {
        hexArray.push(row);
        row = [];
      }
      row.push(byte.toString(16));
    });

    hexArray.push(row);

    return hexArray;
  }

  parseJson(text) {
    try {
      JSON.parse(text);
    } catch (e) {
      return text;
    }
    return JSON.parse(text);
  }

  isJsonObjectOrArray(text) {
    try {
      JSON.parse(text);
    } catch (e) {
      return typeof text === 'object';
    }
    return typeof JSON.parse(text) === 'object';
  }

  // remove(value) {
  //
  //   const index = this.filters.indexOf(value);
  //   if (index >= 0) {
  //
  //     this.filters = [
  //       ...this.filters.slice(0, index),
  //       ...this.filters.slice(index + 1)
  //     ];
  //
  //     // dispatch action
  //     this.store.dispatch({
  //       type: 'STORAGE_ACTION_FILTER',
  //       payload: this.filters,
  //     });
  //
  //   }
  //   this.storageActionInput.nativeElement.blur();
  //   // console.log('[remove]', this.filters);
  //
  // }

  // selected(event: MatAutocompleteSelectedEvent): void {
  //
  //   // add only new properties
  //   if (this.filters.indexOf(event.option.viewValue) === -1) {
  //
  //     this.filters = [
  //       ...this.filters,
  //       event.option.viewValue,
  //     ];
  //
  //     // dispatch action
  //     this.store.dispatch({
  //       type: 'STORAGE_ACTION_FILTER',
  //       payload: this.filters,
  //     });
  //
  //   }
  //
  //   this.storageActionInput.nativeElement.blur();
  //   // console.log('[selected]', this.filters);
  //
  // }

  // openFilter() {
  //   // this.autocomplete.openPanel();
  //   // console.log('[openFilter]');
  // }

  // ngAfterViewChecked() {
  //
  //   // trigger only for screen view change
  //   if (this.viewChange) {
  //
  //     // console.log('[storage-action][ngAfterViewChecked] tableDataSource + ', this.storageActionBlocks, this.tableDataSource);
  //
  //     // table data source
  //     this.storageActionBlocks.map((block, index) => {
  //       // console.log('[paginator]', this.paginators.toArray()[index]);
  //       // console.log('[table]', block, index, this.tableDataSource[block]);
  //       this.tableDataSource[block].paginator = this.paginators.toArray()[index];
  //
  //     });
  //
  //     // prevent multiple loads on same screen view
  //     this.viewChange = false;
  //
  //   }
  //
  // }

  ngOnDestroy() {
    console.log('[storage-action] OnDestroy');

    this.store.dispatch({
      type: 'STORAGE_BLOCK_ACTION_RESET'
    });

    // unsubscribe router
    this.routerParams.unsubscribe();

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }
}
