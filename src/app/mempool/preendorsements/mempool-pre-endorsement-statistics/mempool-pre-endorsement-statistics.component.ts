import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { refreshBlock } from '@shared/constants/animations';
import {
  selectMempoolPreEndorsementCurrentRound,
  selectMempoolPreEndorsementStatistics
} from '@mempool/preendorsements/mempool-pre-endorsement/mempool-pre-endorsement.reducer';
import { MempoolPreEndorsementStatistics } from '@shared/types/mempool/preendorsement/mempool-preendorsement-statistics.type';
import { MempoolPartialRound } from '@shared/types/mempool/common/mempool-partial-round.type';
import { selectNetworkCurrentBlock } from '@network/network-stats/network-stats.reducer';
import { NetworkStatsLastAppliedBlock } from '@shared/types/network/network-stats-last-applied-block.type';
import Timeout = NodeJS.Timeout;


@Component({
  selector: 'app-mempool-preendorsement-statistics',
  templateUrl: './mempool-pre-endorsement-statistics.component.html',
  styleUrls: ['./mempool-pre-endorsement-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [refreshBlock]
})
export class MempoolPreEndorsementStatisticsComponent implements OnInit {

  statistics$: Observable<MempoolPreEndorsementStatistics>;
  currentBlock$: Observable<NetworkStatsLastAppliedBlock>;
  currentRound$: Observable<MempoolPartialRound>;
  previousBlockElapsedTime: number;
  readonly elapsedTime$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  private interval: Timeout;

  constructor(private store: Store<State>,
              private zone: NgZone) { }

  readonly trackStats = entry => entry.value;

  ngOnInit(): void {
    this.listenToEndorsementStatisticsChanges();
  }

  private listenToEndorsementStatisticsChanges(): void {
    this.statistics$ = this.store.select(selectMempoolPreEndorsementStatistics);
    this.currentRound$ = this.store.select(selectMempoolPreEndorsementCurrentRound);
    this.currentBlock$ = this.store.select(selectNetworkCurrentBlock).pipe(
      filter(Boolean),
      distinctUntilChanged(),
      tap(() => {
        this.zone.runOutsideAngular(() => {
          this.previousBlockElapsedTime = this.elapsedTime$.value;
          clearInterval(this.interval);
          this.startTimer();
        });
        this.elapsedTime$.next(0);
      })
    );
  }

  private startTimer(): void {
    this.interval = setInterval(() =>
      this.zone.run(() =>
        this.elapsedTime$.next(this.elapsedTime$.value + 0.1)
      ), 100);
  }
}
