import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { Observable } from 'rxjs';
import { MempoolEndorsementStatistics } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-statistics.type';
import { selectMempoolEndorsementStatistics } from '@mempool/mempool.reducer';

@Component({
  selector: 'app-mempool-endorsement-statistics',
  templateUrl: './mempool-endorsement-statistics.component.html',
  styleUrls: ['./mempool-endorsement-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolEndorsementStatisticsComponent implements OnInit {

  stats$: Observable<MempoolEndorsementStatistics>;

  readonly trackStats = entry => entry.value;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.listenToEndorsementStatisticsChanges();
  }

  private listenToEndorsementStatisticsChanges(): void {
    this.stats$ = this.store.select(selectMempoolEndorsementStatistics).pipe();
  }
}
