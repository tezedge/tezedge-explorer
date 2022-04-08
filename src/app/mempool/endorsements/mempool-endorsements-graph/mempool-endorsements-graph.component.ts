import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { selectMempoolEndorsements } from '@mempool/endorsements/mempool-endorsement/mempool-endorsement.reducer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MempoolEndorsement } from '@shared/types/mempool/endorsement/mempool-endorsement.type';

@UntilDestroy()
@Component({
  selector: 'app-mempool-endorsements-graph',
  templateUrl: './mempool-endorsements-graph.component.html',
  styleUrls: ['./mempool-endorsements-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolEndorsementsGraphComponent implements OnInit {

  operationsLength: number;
  times: number[] = [];

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listenToEndorsementsChange();
  }

  private listenToEndorsementsChange(): void {
    this.store.select(selectMempoolEndorsements)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((endorsements: MempoolEndorsement[]) => {
        this.operationsLength = endorsements.length;
        this.times = endorsements.map(e => e.receiveHashTime).filter(t => t !== undefined && t !== null);
        this.cdRef.detectChanges();
      });
  }
}
