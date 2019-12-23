import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil, filter } from 'rxjs/operators'

import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocompleteTrigger } from '@angular/material';

@Component({
  selector: 'app-storage-action',
  templateUrl: './storage-action.component.html',
  styleUrls: ['./storage-action.component.css']
})

export class StorageActionComponent implements OnInit {
  public search;
  public block;
  public blockHash;
  public addressHash;
  public storageBlock;
  public storageAction;
  public storageActionList;
  public storageActionBlocks;
  public storageActionShow;
  public storageActionDetail = false;
  public tableDataSource = [];
  public routerParams;
  public routerScroll;
  public viewChange = false;
  public viewLast;
  public filters = [];
  public onDestroy$ = new Subject();
  public storageActionInputForm = new FormControl();

  @ViewChild('storageActionInput', { static: true }) storageActionInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger, { static: true }) autocomplete: MatAutocompleteTrigger;

  @ViewChildren(MatPaginator) paginators: QueryList<MatPaginator>;


  constructor(
    public store: Store<any>,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {

    // wait for data changes from redux
    this.store.select('storageAction')
      .pipe(
        takeUntil(this.onDestroy$),
        filter(data => data.entities.length !== 0)
      )
      .subscribe(data => {

        this.storageAction = data;
        this.storageActionShow = data.entities.length > 0 ? true : false;

        // save view change
        this.viewChange = this.viewLast !== data.view ? true : false;
        this.viewLast = data.view;

        // chnage data only after view change
        if (this.viewChange) {

          // clean up tableData Source
          this.tableDataSource = [];
          this.storageActionBlocks = data.blocks;
          this.storageActionBlocks.map(block => {

            const tableData = data.ids[block].map(id => ({ ...data.entities[id] }));
            this.tableDataSource[block] = new MatTableDataSource<any>(tableData);

          });

        }

      });

    // get url params
    // TODO: unsubscribe after destroy
    this.routerParams = this.route.params.subscribe(params => {

      // move to scroll
      window.scrollTo(0, 0);

      // console.log('[storage][actions]', params, params['search']);

      // process block ID
      const blockPrefix = params['search'].substr(0, 1);
      if (blockPrefix === "B") {

        // triger action and get blocks data
        this.store.dispatch({
          type: 'STORAGE_BLOCK_ACTION_LOAD',
          payload: {
            blockHash: params['search']
          }
        });

      }

      // porcess address id
      const addressPrefix = params['search'].substr(0, 3);
      if (addressPrefix === "tz1" || addressPrefix === "tz2" || addressPrefix === "tz3" || addressPrefix === "KT1") {

        // triger action and get blocks data
        this.store.dispatch({
          type: 'STORAGE_ADDRESS_ACTION_LOAD',
          payload: {
            addressHash: params['search']
          }
        });

      }

    });


  }

  expandedDetail(row) {
    this.storageActionDetail = this.storageActionDetail ? false : true;
    console.log('[storage][action] expandedDetail', this.storageActionDetail, row);
  }

  remove(filter) {
    const index = this.filters.indexOf(filter);
    if (index >= 0) {
      this.filters.splice(index, 1);
    }
    console.log('[remove]', this.filters);

  }

  selected(event: MatAutocompleteSelectedEvent): void {

    // add only new properties
    if (this.filters.indexOf(event.option.viewValue) === -1) {
      this.filters.push(event.option.viewValue);
    }
    this.storageActionInput.nativeElement.blur();

    console.log('[selected]', this.filters);
  }

  openFilter() {
    console.log('[openFilter]');
    this.autocomplete.openPanel();
  }

  ngAfterViewChecked() {

    // trigger only for screen view change
    if (this.viewChange) {

      // console.log('[storage-action][ngAfterViewChecked] tableDataSource + ', this.storageActionBlocks, this.tableDataSource);

      // table data source
      this.storageActionBlocks.map((block, index) => {
        // console.log('[paginator]', this.paginators.toArray()[index]);
        // console.log('[table]', block, index, this.tableDataSource[block]);
        this.tableDataSource[block].paginator = this.paginators.toArray()[index];

      });

      // prevent multiple loads on same screen view
      this.viewChange = false;

    }

  }

  ngOnDestroy() {

    console.log('[storage-action] OnDestroy');

    // unsubscribe router
    this.routerParams.unsubscribe();

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
