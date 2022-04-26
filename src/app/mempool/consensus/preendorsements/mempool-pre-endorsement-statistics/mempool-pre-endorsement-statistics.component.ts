import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { refreshBlock } from '@shared/constants/animations';
import {
  selectMempoolPreEndorsementCurrentRound,
  selectMempoolPreEndorsementStatistics
} from '@mempool/consensus/preendorsements/mempool-pre-endorsement/mempool-pre-endorsement.reducer';
import { MempoolPreEndorsementStatistics } from '@shared/types/mempool/preendorsement/mempool-preendorsement-statistics.type';
import { formatNumber } from '@angular/common';
import { MICROSECOND_FACTOR } from '@shared/constants/unit-measurements';
import { MempoolConsensusRound } from '@shared/types/mempool/consensus/mempool-consensus-round.type';
import Timeout = NodeJS.Timeout;


@Component({
  selector: 'app-mempool-preendorsement-statistics',
  templateUrl: './mempool-pre-endorsement-statistics.component.html',
  styleUrls: ['./mempool-pre-endorsement-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [refreshBlock]
})
export class MempoolPreEndorsementStatisticsComponent implements OnInit {

  readonly elapsedTime$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  statistics$: Observable<MempoolPreEndorsementStatistics>;
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
    this.statistics$ = this.store.select(selectMempoolPreEndorsementStatistics);
    this.currentRound$ = this.store.select(selectMempoolPreEndorsementCurrentRound)
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
