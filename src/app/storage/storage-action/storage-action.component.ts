import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil, filter } from 'rxjs/operators'


@Component({
  selector: 'app-storage-action',
  templateUrl: './storage-action.component.html',
  styleUrls: ['./storage-action.component.css']
})

export class StorageActionComponent implements OnInit {
  public search
  public block
  public blockHash
  public addressHash
  public storageBlock
  public storageAction
  public storageActionList
  public storageActionBlocks
  public storageActionShow
  public storageActionDetail = false
  public tableDataSource = []
  public routerParams
  public routerScroll
  public onDestroy$ = new Subject()

  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
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

        this.storageAction = data
        this.storageActionShow = data.entities.length > 0 ? true : false;

        this.storageActionBlocks = data.blocks;

        this.storageActionBlocks.map(block => {

          // console.log('[block]', block);

          const tableData = data.ids[block].map(id => ({ ...data.entities[id] }));
          this.tableDataSource[block] = new MatTableDataSource<any>(tableData);
          // this.tableDataSource[block].paginator = this.paginators.first;

        });

      });

    // wait for data changes from redux
    // this.store.select('storageBlock')
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe(data => {

    //     this.storageBlock = data

    //   });

    // get url params
    // TODO: unsubscribe after destroy
    this.routerParams = this.route.params.subscribe(params => {

      // move to scroll
      window.scrollTo(0, 0)

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

  // launched for every row
  isRowExpanded = (i: number, row: Object) => {

    // console.log('[isRowExpanded]', i, row);
    return this.storageActionDetail;
    // return row.hasOwnProperty('detailRow');

  }

  ngAfterViewInit() {

    // console.log('[paginator]', this.paginators);
    // this.paginators.forEach(alertInstance => console.log('[+][paginator]', alertInstance));

  }

  ngOnDestroy() {

    // unsubscribe router
    this.routerParams.unsubscribe();

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
