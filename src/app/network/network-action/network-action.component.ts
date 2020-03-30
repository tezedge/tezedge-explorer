import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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

  public networkJSONView

  public tableDataSource
  public onDestroy$ = new Subject()
  public expandedElement


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit(): void {

    this.networkJSONView = {
      payload: {
        port: 9732,
        versions: [
          {
            name: "TEZOS_ALPHANET_BABYLON_2019-09-27T07:43:32Z",
            major: 0,
            minor: 0
          }
        ],
        public_key: [
          239,
          161,
          227,
          185,
          71,
          194,
          206,
          248,
          222,
          228,
          148,
          34,
          219,
          172,
          247,
          176,
          163,
          10,
          200,
          88,
          31,
          77,
          246,
          75,
          43,
          120,
          190,
          65,
          157,
          49,
          4,
          104
        ],
        proof_of_work_stamp: [
          69,
          51,
          191,
          110,
          48,
          19,
          254,
          148,
          156,
          53,
          10,
          228,
          63,
          51,
          251,
          129,
          118,
          202,
          250,
          32,
          98,
          50,
          65,
          227
        ],
        message_nonce: [
          29,
          168,
          2,
          130,
          5,
          251,
          222,
          38,
          108,
          216,
          105,
          249,
          186,
          113,
          119,
          31,
          47,
          184,
          86,
          204,
          96,
          7,
          145,
          62
        ]
      }
    };

      // wait for data changes from redux
      this.store.select('networkAction')
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(data => {

          console.log('[networkAction]', data);

          this.networkAction = data;

          this.networkActionShow = data.ids.length > 0 ? true : false;
          this.networkActionList = data.ids.map(id => ({ id, ...data.entities[id] }));

          this.tableDataSource = new MatTableDataSource<any>(this.networkActionList);
          this.tableDataSource.paginator = this.paginator;

        });

      // triger action and get network data
      this.store.dispatch({
        type: 'NETWORK_ACTION_LOAD',
      });

    }

    expandedDetail(row) {
      // this.storageActionDetail = this.storageActionDetail ? false : true;
      console.log('[network][action] expandedDetail', this.networkAction, row);
    }

    ngOnDestroy() {

      // close all observables
      this.onDestroy$.next();
      this.onDestroy$.complete();

    }

  }
