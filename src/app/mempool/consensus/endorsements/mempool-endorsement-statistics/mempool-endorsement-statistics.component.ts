import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { MempoolEndorsementStatistics } from '@shared/types/mempool/endorsement/mempool-endorsement-statistics.type';
import {
  selectMempoolEndorsementCurrentRound,
  selectMempoolEndorsementStatistics
} from '@mempool/consensus/endorsements/mempool-endorsement/mempool-endorsement.index';
import { refreshBlock } from '@shared/constants/animations';
import { MICROSECOND_FACTOR } from '@shared/constants/unit-measurements';
import { formatNumber } from '@angular/common';
import Timeout = NodeJS.Timeout;
import { MempoolConsensusRound } from '@shared/types/mempool/consensus/mempool-consensus-round.type';


@Component({
  selector: 'app-mempool-endorsement-statistics',
  templateUrl: './mempool-endorsement-statistics.component.html',
  styleUrls: ['./mempool-endorsement-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [refreshBlock]
})
export class MempoolEndorsementStatisticsComponent implements OnInit {

  readonly elapsedTime$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  statistics$: Observable<MempoolEndorsementStatistics>;
  currentRound$: Observable<MempoolConsensusRound>;
  previousBlockElapsedTime: number;

  private interval: Timeout;
  private round: MempoolConsensusRound;

  constructor(private store: Store<State>,
              private zone: NgZone) { }

  readonly trackStats = entry => entry.value;

  ngOnInit(): void {
    this.listenToEndorsementStatisticsChanges();
  }

  private listenToEndorsementStatisticsChanges(): void {
    this.statistics$ = this.store.select(selectMempoolEndorsementStatistics);
    this.currentRound$ = this.store.select(selectMempoolEndorsementCurrentRound)
      .pipe(tap(round => {
        if (this.round?.blockLevel !== round?.blockLevel) {
          this.round = round;
          this.zone.runOutsideAngular(() => {
            this.previousBlockElapsedTime = this.elapsedTime$.value;
            clearInterval(this.interval);
            this.startTimer();
          });
          const newValue = formatNumber((Date.now() - (Number(this.round?.blockTimestamp) / MICROSECOND_FACTOR)) / 1000, 'en-US', '1.1-1');
          this.elapsedTime$.next(Math.max(Number(newValue), 0));
        }
      }));
  }

  private startTimer(): void {
    this.interval = setInterval(() =>
      this.zone.run(() =>
        this.elapsedTime$.next(this.elapsedTime$.value + 0.1)
      ), 100);
  }
}
