import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import {
  MEMPOOL_CONSENSUS_CONSTANTS_LOAD,
  MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS,
  MEMPOOL_CONSENSUS_INIT,
  MEMPOOL_CONSENSUS_SET_ROUND,
  MEMPOOL_CONSENSUS_START_SEARCHING_ROUNDS,
  MEMPOOL_CONSENSUS_STOP,
  MempoolConsensusConstantsLoad,
  MempoolConsensusGetBlockRounds,
  MempoolConsensusInit,
  MempoolConsensusSetRound,
  MempoolConsensusStartSearchingRounds,
  MempoolConsensusStop
} from '@mempool/consensus/mempool-consensus.actions';
import { selectNetworkLastAppliedBlockLevel } from '@network/network-stats/network-stats.reducer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter, map, take } from 'rxjs/operators';
import {
  MempoolConsensusState,
  selectMempoolConsensusConstants,
  selectMempoolConsensusRounds,
  selectMempoolConsensusState
} from '@mempool/consensus/mempool-consensus.index';
import { BehaviorSubject } from 'rxjs';
import { formatNumber } from '@angular/common';
import { MICROSECOND_FACTOR } from '@shared/constants/unit-measurements';
import { MempoolConsensusRound } from '@shared/types/mempool/consensus/mempool-consensus-round.type';
import Timeout = NodeJS.Timeout;

@UntilDestroy()
@Component({
  selector: 'app-mempool-consensus',
  templateUrl: './mempool-consensus.component.html',
  styleUrls: ['./mempool-consensus.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolConsensusComponent implements OnInit, OnDestroy {

  readonly elapsedTime$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  state: MempoolConsensusState;
  showRoundArrows: boolean;

  private horizontalScrollingContainer: ElementRef<HTMLDivElement>;

  @ViewChild('hsc', { static: false }) set content(content) {
    if (content) {
      this.horizontalScrollingContainer = content;
    }
  }

  private interval: Timeout;
  private latestBlockLevel: number;

  constructor(private store: Store<State>,
              private zone: NgZone,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.dispatch<MempoolConsensusConstantsLoad>({ type: MEMPOOL_CONSENSUS_CONSTANTS_LOAD });
    this.store.dispatch<MempoolConsensusInit>({ type: MEMPOOL_CONSENSUS_INIT });
    this.listenToConstantsChange();
    this.listenToConsensusChange();
  }

  private listenToConstantsChange(): void {
    this.store.select(selectMempoolConsensusConstants).pipe(
      untilDestroyed(this),
      filter(Boolean),
      take(1)
    ).subscribe(() => {
      this.listenToBlockChange();
    });
  }

  private listenToBlockChange(): void {
    this.store.select(selectNetworkLastAppliedBlockLevel).pipe(
      untilDestroyed(this),
      filter(Boolean),
      distinctUntilChanged()
    ).subscribe((currentBlock: number) => {
      this.latestBlockLevel = currentBlock;
      const isFirstBlock = this.state?.rounds.length === 0;
      if (isFirstBlock) {
        this.getBlockRounds(currentBlock - 1);
      }
      this.getBlockRounds(currentBlock, true);
    });
  }

  private getBlockRounds(level: number, isLastAppliedBlock: boolean = false): void {
    this.store.dispatch<MempoolConsensusGetBlockRounds>({
      type: MEMPOOL_CONSENSUS_GET_BLOCK_ROUNDS,
      payload: { blockLevel: level, isLastAppliedBlock }
    });
  }

  private listenToConsensusChange(): void {
    this.store.select(selectMempoolConsensusState).pipe(
      untilDestroyed(this)
    ).subscribe(state => {
      this.state = state;
      this.cdRef.detectChanges();
      this.checkRoundArrowsShowing();
    });

    this.store.select(selectMempoolConsensusRounds).pipe(
      untilDestroyed(this),
      filter(rounds => rounds.length > 0 && !rounds.every(r => r.blockLevel === rounds[0].blockLevel)),
      map(rounds => rounds[rounds.length - 1])
    ).subscribe((round: MempoolConsensusRound) => {
      this.calculateTime(round);
    });
  }

  private checkRoundArrowsShowing(): void {
    if (!this.horizontalScrollingContainer) {
      return;
    }
    const horizontalScrollingContainerWidth = this.horizontalScrollingContainer.nativeElement.clientWidth;
    const firstChildWidth = this.horizontalScrollingContainer.nativeElement.firstElementChild.clientWidth;
    if (firstChildWidth > horizontalScrollingContainerWidth && !this.showRoundArrows) {
      this.showRoundArrows = true;
      this.cdRef.detectChanges();
    } else if (firstChildWidth <= horizontalScrollingContainerWidth && this.showRoundArrows) {
      this.showRoundArrows = false;
      this.cdRef.detectChanges();
    }
  }

  private calculateTime(round: MempoolConsensusRound): void {
    if (!round) {
      return;
    }
    const newValue = formatNumber((Date.now() - (Number(round.blockTimestamp) / MICROSECOND_FACTOR)) / 1000, 'en-US', '1.0-0');
    this.elapsedTime$.next(Math.min(Number(newValue), round.maxTime));

    this.zone.runOutsideAngular(() => {
      clearInterval(this.interval);
      this.startTimer(round.maxTime);
    });
  }

  private startTimer(maxTime: number): void {
    this.interval = setInterval(() => {
      this.zone.run(() => {
        this.elapsedTime$.next(Math.min(this.elapsedTime$.value + 1, maxTime));
        if (this.elapsedTime$.value + 1 > maxTime) {
          clearInterval(this.interval);

          this.store.dispatch<MempoolConsensusStartSearchingRounds>({
            type: MEMPOOL_CONSENSUS_START_SEARCHING_ROUNDS,
            payload: { blockLevel: this.latestBlockLevel }
          });
        }
      });
    }, 1000);
  }

  selectRound(i: number): void {
    if (this.state.activeRoundIndex === i) {
      return;
    }
    this.store.dispatch<MempoolConsensusSetRound>({ type: MEMPOOL_CONSENSUS_SET_ROUND, payload: i });
  }

  scrollBy(left: number): void {
    this.horizontalScrollingContainer.nativeElement.scrollBy({ top: 0, left, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    this.store.dispatch<MempoolConsensusStop>({ type: MEMPOOL_CONSENSUS_STOP });
  }
}
