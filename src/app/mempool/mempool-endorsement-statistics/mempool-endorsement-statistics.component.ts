import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { MempoolEndorsementStatistics } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-statistics.type';
import { selectMempoolEndorsementCurrentBlock, selectMempoolEndorsementStatistics } from '@mempool/mempool-endorsement/mempool-endorsement.reducer';
import { refreshBlock } from '@shared/constants/animations';
import Timeout = NodeJS.Timeout;


@Component({
  selector: 'app-mempool-endorsement-statistics',
  templateUrl: './mempool-endorsement-statistics.component.html',
  styleUrls: ['./mempool-endorsement-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [refreshBlock]
})
export class MempoolEndorsementStatisticsComponent implements OnInit {

  statistics$: Observable<MempoolEndorsementStatistics>;
  currentBlock$: Observable<number>;
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
    this.statistics$ = this.store.select(selectMempoolEndorsementStatistics);
    this.currentBlock$ = this.store.select(selectMempoolEndorsementCurrentBlock).pipe(
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
