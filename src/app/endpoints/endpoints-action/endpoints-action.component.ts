import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-endpoints-action',
  templateUrl: './endpoints-action.component.html',
  styleUrls: ['./endpoints-action.component.css']
})
export class EndpointsActionComponent implements OnInit {

  public endpointsAction
  public endpointsActionList
  public endpointsActionShow
  public endpointsActionFilter

  public endpointsJSONView

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

        // triger action and get endpoints data
        this.store.dispatch({
          type: 'ENDPOINTS_ACTION_LOAD',
          payload: params.address ? '/' + params.address : '',
        });

      });

    // wait for data changes from redux
    this.store.select('endpointsAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.endpointsAction = data;

        this.endpointsActionShow = data.ids.length > 0 ? true : false;
        this.endpointsActionList = data.ids.map(id => ({ id, ...data.entities[id] }));

        this.tableDataSource = new MatTableDataSource<any>(this.endpointsActionList);
        this.tableDataSource.paginator = this.paginator;

      });

  }

  expandedDetail(row) {
    console.log('[endpoints][action] expandedDetail', this.endpointsAction, row);
  }

  ngOnDestroy() {

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
