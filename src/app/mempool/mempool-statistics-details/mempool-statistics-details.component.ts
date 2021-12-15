import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MempoolStatisticsOperation } from '@shared/types/mempool/statistics/mempool-statistics-operation.type';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { selectMempoolStatisticsActiveOperation } from '@mempool/mempool-statistics/mempool-statistics.reducer';

@Component({
  selector: 'app-mempool-statistics-details',
  templateUrl: './mempool-statistics-details.component.html',
  styleUrls: ['./mempool-statistics-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolStatisticsDetailsComponent implements OnInit {

  activeOperation$: Observable<MempoolStatisticsOperation>;
  activeOperationIndex = -1;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.listenToStatisticsChanges();
  }

  private listenToStatisticsChanges(): void {
    this.activeOperation$ = this.store.select(selectMempoolStatisticsActiveOperation);
  }

}
