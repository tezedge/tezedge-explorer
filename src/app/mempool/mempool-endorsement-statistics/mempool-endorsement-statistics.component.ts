import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { selectMempoolEndorsementCurrentBlock, selectMempoolEndorsementStatistics } from '@mempool/mempool.reducer';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { MempoolEndorsementStatistics } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-statistics.type';
import Timeout = NodeJS.Timeout;

export const refreshBlock = trigger('refreshBlock', [
  transition('* => *', [
    style({ backgroundColor: 'lightgray' }),
    animate(250, style({ backgroundColor: 'transparent' })),
  ])
]);


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
  elapsedTime$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  previousBlockElapsedTime: number;

  private interval: Timeout;

  readonly trackStats = entry => entry.value;

  constructor(private store: Store<State>,
              private zone: NgZone) { }

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
