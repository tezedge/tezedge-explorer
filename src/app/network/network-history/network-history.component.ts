import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FormattedNetworkHistory, VotingCycle, VotingPeriodRow } from './models/formatted-network-history';


@Component({
  selector: 'app-network-history',
  templateUrl: './network-history.component.html',
  styleUrls: ['./network-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NetworkHistoryComponent implements OnInit, OnDestroy {

  private networkHistory;
  public formattedNetworkHistory: Array<FormattedNetworkHistory>;
  public networkHistoryPanel;

  public networkHistoryPanelShow = false;
  public networkStats;
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

  public onDestroy$ = new Subject();

  constructor(
    private cd: ChangeDetectorRef,
    public store: Store<any>
  ) { }

  ngOnInit() {

    // wait for data changes from redux
    // this.store.select('networkStats')
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe(data => {
    //     console.log(3278237);
    //     this.networkStats = data;
    //
    //   });

    // wait for data changes from redux
    this.store.select('networkHistory')
      .pipe(
        debounceTime(200),
        takeUntil(this.onDestroy$)
      )
      .subscribe(data => this.mapDataFromHistory(data));
  }

  // remove this after the logic has been moved to the backend and get data straight from the ngrx
  private mapDataFromHistory(data): void {
    this.networkHistory = data.ids.map(id => data.entities[id]);

    const cyclesPerVotingPeriod = 8;
    const votingPeriodPerRow = 2;

    this.formattedNetworkHistory = [];

    for (let cycle = 0; cycle < this.networkHistory.length; ++cycle) {
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
      rowPositions[votingPeriodRowPosition].cycles[votingPeriodPosition] = this.networkHistory[cycle];

    }
    this.cd.markForCheck();
  }

  readonly trackByRowPosition = (index: number, row: FormattedNetworkHistory) => row.id;
  readonly trackByRowPeriod = (index: number, period: VotingPeriodRow) => period.id;
  readonly trackByCycle = (index: number, cycle: VotingCycle) => cycle.id;

  // used for debugging
  render() {
    this.cd.markForCheck();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}

