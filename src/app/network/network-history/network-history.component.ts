import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';
import { FormattedNetworkHistory, VotingCycle, VotingPeriodRow } from './models/formatted-network-history';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { State } from '../../app.reducers';
import { NetworkHistoryEntity } from '../../shared/types/network/network-history-entity.type';
import { NetworkHistory } from '../../shared/types/network/network-history.type';


@UntilDestroy()
@Component({
  selector: 'app-network-history',
  templateUrl: './network-history.component.html',
  styleUrls: ['./network-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkHistoryComponent implements OnInit {

  private networkHistoryEntities: Array<NetworkHistoryEntity>;
  public formattedNetworkHistory: Array<FormattedNetworkHistory>;

  public networkHistoryConfig = {
    row_length: 32,
    row_height: 20,
    // color: {
    //   finishedBlocks: "#00dbc6",
    //   appliedBlocks: "#000000",
    //   empty: "#f2f2f2",
    //   border: "#f2f2f2",
    // }
    color: {
      finishedBlocks: '#000000',
      appliedBlocks: '#00dbc6',
      empty: '#f2f2f2',
      border: 'lightgrey',
    }
  };

  constructor(
    private cd: ChangeDetectorRef,
    public store: Store<State>
  ) { }

  ngOnInit() {
    this.store.select('networkHistory')
      .pipe(
        debounceTime(200),
        untilDestroyed(this)
      )
      .subscribe((networkHistory: NetworkHistory) => this.mapDataFromHistory(networkHistory));
  }

  // remove this after the logic has been moved to the backend and get data straight from the ngrx
  private mapDataFromHistory(networkHistory: NetworkHistory): void {
    this.networkHistoryEntities = networkHistory.ids.map(id => networkHistory.entities[id]);

    const cyclesPerVotingPeriod = 8;
    const votingPeriodPerRow = 2;

    this.formattedNetworkHistory = [];

    for (let cycle = 0; cycle < this.networkHistoryEntities.length; ++cycle) {
      // get voting period
      const votingPeriod = Math.floor(cycle / cyclesPerVotingPeriod);
      // this value represent position in voting period
      const votingPeriodPosition = cycle % cyclesPerVotingPeriod;
      // get voting period Row
      const votingPeriodRow = Math.floor(votingPeriod / votingPeriodPerRow);
      // voting period row position
      const votingPeriodRowPosition = votingPeriod % votingPeriodPerRow;

      // create new element in array
      let currentVotingPeriodRow = this.formattedNetworkHistory.find(row => row.id === votingPeriodRow);
      if (!currentVotingPeriodRow) {
        this.formattedNetworkHistory[votingPeriodRow] = { id: votingPeriodRow, votingPeriodRows: [] };
        currentVotingPeriodRow = this.formattedNetworkHistory[votingPeriodRow];
      }
      // create new element in array
      const rowPositions = currentVotingPeriodRow.votingPeriodRows;
      if (!rowPositions.find(pos => pos.id === votingPeriodRowPosition)) {
        rowPositions[votingPeriodRowPosition] = { id: votingPeriodRowPosition, cycles: [] };
      }

      // save element
      rowPositions[votingPeriodRowPosition].cycles[votingPeriodPosition] = this.networkHistoryEntities[cycle];

    }
    this.cd.markForCheck();
  }

  readonly trackByRowPosition = (index: number, row: FormattedNetworkHistory) => row.id;
  readonly trackByRowPeriod = (index: number, period: VotingPeriodRow) => period.id;
  readonly trackByCycle = (index: number, cycle: VotingCycle) => cycle.id;
}

