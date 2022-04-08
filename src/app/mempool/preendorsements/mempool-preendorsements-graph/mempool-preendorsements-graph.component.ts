import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MempoolPreEndorsement } from '@shared/types/mempool/preendorsement/mempool-preendorsement.type';
import { selectMempoolPreEndorsements } from '@mempool/preendorsements/mempool-pre-endorsement/mempool-pre-endorsement.reducer';

@UntilDestroy()
@Component({
  selector: 'app-mempool-preendorsements-graph',
  templateUrl: './mempool-preendorsements-graph.component.html',
  styleUrls: ['./mempool-preendorsements-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolPreendorsementsGraphComponent implements OnInit {

  operationsLength: number;
  times: number[] = [];

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listenToEndorsementsChange();
  }

  private listenToEndorsementsChange(): void {
    this.store.select(selectMempoolPreEndorsements)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((endorsements: MempoolPreEndorsement[]) => {
        this.operationsLength = endorsements.length;
        this.times = endorsements.map(e => e.receiveHashTime).filter(t => t !== undefined && t !== null);
        this.cdRef.detectChanges();
      });
  }
}
