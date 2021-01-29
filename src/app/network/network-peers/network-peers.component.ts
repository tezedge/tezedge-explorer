import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-network-peers',
  templateUrl: './network-peers.component.html',
  styleUrls: ['./network-peers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkPeersComponent implements OnInit, OnDestroy {

  public networkPeersList
  public networkPeersShow
  public networkPeersMetrics
  public tableDataSource
  public onDestroy$ = new Subject()

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.tableDataSource = new MatTableDataSource<any>();

    // wait for data changes from redux
    this.store.select('networkPeers')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.networkPeersList = data.ids.map(id => ({ id, ...data.entities[id] }))

        this.networkPeersShow = data.ids.length > 0;

        this.networkPeersMetrics = data.metrics;

        this.tableDataSource.data = this.networkPeersList;

        this.tableDataSource.paginator = this.paginator;

      })

  }

  readonly trackByPeerId = (index: number, peer: any) => peer.id;

  ngOnDestroy() {

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }


}
