import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { mempoolBakingRights } from '@mempool/consensus/baking-rights/mempool-baking-rights/mempool-baking-rights.index';
import { filter } from 'rxjs/operators';
import { MempoolBakingRight } from '@shared/types/mempool/baking-rights/mempool-baking-right.type';

@UntilDestroy()
@Component({
  selector: 'app-mempool-baking-rights-graph',
  templateUrl: './mempool-baking-rights-graph.component.html',
  styleUrls: ['./mempool-baking-rights-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolBakingRightsGraphComponent implements OnInit {

  times: number[] = [];

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listenToMempoolBakingRightsChange();
  }

  private listenToMempoolBakingRightsChange(): void {
    this.store.select(mempoolBakingRights)
      .pipe(
        untilDestroyed(this),
        filter(rights => rights.length > 0),
      )
      .subscribe((rights: MempoolBakingRight[]) => {
        this.times = rights.map(r => r.receivedTime).filter(t => t !== undefined && t !== null);
        this.cdRef.detectChanges();
      });
  }
}
