import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { State } from '@app/app.index';
import { NetworkPeers } from '@shared/types/network/network-peers.type';
import { NetworkPeersEntity } from '@shared/types/network/network-peers-entity.type';
import { selectNetworkPeers } from '@monitoring/monitoring.index';

@UntilDestroy()
@Component({
  selector: 'app-network-peers',
  templateUrl: './network-peers.component.html',
  styleUrls: ['./network-peers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkPeersComponent implements OnInit {

  tableDataSource: MatTableDataSource<NetworkPeersEntity>;

  @ViewChild(MatPaginator, { static: true }) private paginator: MatPaginator;

  constructor(private store: Store<State>) { }

  readonly trackByPeerId = (index: number, peer: any) => peer.id;

  ngOnInit(): void {
    this.tableDataSource = new MatTableDataSource<NetworkPeersEntity>();

    this.store.select(selectNetworkPeers)
      .pipe(untilDestroyed(this))
      .subscribe((data: NetworkPeers) => {
        this.tableDataSource.data = data.ids.map((id: string) => ({ id, ...data.entities[id] }));
        this.tableDataSource.paginator = this.paginator;
      });
  }
}
