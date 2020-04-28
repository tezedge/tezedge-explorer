import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-network-action',
  templateUrl: './network-action.component.html',
  styleUrls: ['./network-action.component.css']
})
export class NetworkActionComponent implements OnInit {

  public networkAction
  public networkActionList
  public networkActionShow
  public networkActionFilter


  public networkJSONView

  public tableDataSource
  public onDestroy$ = new Subject()
  public expandedElement


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public store: Store<any>,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.activeRoute.params
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((params) => {

        // triger action and get network data
        this.store.dispatch({
          type: 'NETWORK_ACTION_LOAD',
          payload: params.address ? '/' + params.address : '',
        });

      });

    // wait for data changes from redux
    this.store.select('networkAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.networkAction = data;

        this.networkActionShow = data.idsFilter.length > 0 ? true : false;
        this.networkActionList = data.idsFilter.map(id => ({ id, ...data.entities[id] }));

        this.tableDataSource = new MatTableDataSource<any>(this.networkActionList);
        this.tableDataSource.paginator = this.paginator;

      });


  }

  expandedDetail(row) {
    // this.storageActionDetail = this.storageActionDetail ? false : true;
    console.log('[network][action] expandedDetail', this.networkAction, row);
  }

  filter(filter) {

    // dispatch action
    this.store.dispatch({
      type: 'NETWORK_ACTION_FILTER',
      payload: filter,
    });

  }

  ngOnDestroy() {

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
