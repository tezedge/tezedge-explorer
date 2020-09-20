import {
  ChangeDetectorRef, ChangeDetectionStrategy, Component,
  OnInit, OnDestroy
} from '@angular/core';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';


@Component({
  selector: 'app-network-history',
  templateUrl: './network-history.component.html',
  styleUrls: ['./network-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NetworkHistoryComponent implements OnInit, OnDestroy {

  public networkHistory;
  public networkHistoryFormated;
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
    this.store.select('networkStats')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.networkStats = data;

      });

    // wait for data changes from redux
    this.store.select('networkHistory')
      .pipe(
        takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.networkHistory = data.ids.map(id => data.entities[id]);

        const cyclesPerVotingPeriod = 8;
        const votingPeriodPerRow = 2;

        this.networkHistoryFormated = [];

        for (let cycle = 0; cycle < this.networkHistory.length; ++cycle) {
          // get voting period
          const votingPeriod = Math.floor(cycle / cyclesPerVotingPeriod);
          // this value represetn position in voting period
          const votingPeriodPosition = cycle % cyclesPerVotingPeriod;
          // get voting period Row
          const votingPeriodRow = Math.floor(votingPeriod / votingPeriodPerRow);
          // voting periond row position
          const votingPeriodRowPosition = votingPeriod % votingPeriodPerRow;

          // create new element in array
          if (!this.networkHistoryFormated[votingPeriodRow]) {
            this.networkHistoryFormated[votingPeriodRow] = [];
          }
          // create new element in array
          if (!this.networkHistoryFormated[votingPeriodRow][votingPeriodRowPosition]) {
            this.networkHistoryFormated[votingPeriodRow][votingPeriodRowPosition] = [];
          }

          // save element
          this.networkHistoryFormated[votingPeriodRow][votingPeriodRowPosition][votingPeriodPosition] = this.networkHistory[cycle];

        }

        this.cd.markForCheck();

      });


  }

  // used for debugging
  render() {
    this.cd.markForCheck();
  }

  ngOnDestroy() {

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}

