import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-logs-action',
  templateUrl: './logs-action.component.html',
  styleUrls: ['./logs-action.component.scss']
})
export class LogsActionComponent implements OnInit {

  public logsAction;
  public logsActionList;
  public logsActionShow;
  public logsActionFilter;

  public endpointsJSONView;

  public tableDataSource;
  public onDestroy$ = new Subject();
  public expandedElement;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public store: Store<any>,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    // triger action and get logs data
    this.store.dispatch({
      type: 'LOGS_ACTION_LOAD',
    });

    // wait for data changes from redux
    this.store.select('logsAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.logsAction = data;

        this.logsActionShow = data.ids.length > 0 ? true : false;
        this.logsActionList = data.ids.map(id => ({ id, ...data.entities[id] }));

        this.tableDataSource = new MatTableDataSource<any>(this.logsActionList);
        this.tableDataSource.paginator = this.paginator;

      });

  }

}
