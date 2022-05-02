import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { Observable } from 'rxjs';
import { MempoolBlockRound } from '@shared/types/mempool/common/mempool-block-round.type';
import {
  mempoolBakingRightsActiveRoundIndex,
  mempoolBakingRightsDelta,
  mempoolBakingRightsDetails
} from '@mempool/consensus/baking-rights/mempool-baking-rights/mempool-baking-rights.index';
import { ADD_INFO, InfoAdd } from '@app/layout/error-popup/error-popup.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH, MempoolBakingRightsDeltaSwitch } from '@mempool/consensus/baking-rights/mempool-baking-rights/mempool-baking-rights.actions';

@UntilDestroy()
@Component({
  selector: 'app-mempool-baking-rights-details',
  templateUrl: './mempool-baking-rights-details.component.html',
  styleUrls: ['./mempool-baking-rights-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolBakingRightsDetailsComponent implements OnInit {

  rounds$: Observable<MempoolBlockRound[]>;
  activeRoundIndex: number = 0;
  delta: boolean;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  readonly trackDetails = (index: number, detail: MempoolBlockRound) => detail.baker;

  ngOnInit(): void {
    this.listenToDetailsChanges();
  }

  private listenToDetailsChanges(): void {
    this.rounds$ = this.store.select(mempoolBakingRightsDetails);

    this.store.select(mempoolBakingRightsActiveRoundIndex)
      .pipe(untilDestroyed(this))
      .subscribe(index => {
        this.activeRoundIndex = index;
        this.cdRef.detectChanges();
      });

    this.store.select(mempoolBakingRightsDelta)
      .pipe(untilDestroyed(this))
      .subscribe(delta => this.delta = delta);
  }

  copyHashToClipboard(hash: string): void {
    this.store.dispatch<InfoAdd>({ type: ADD_INFO, payload: 'Copied to clipboard: ' + hash });
  }

  onDeltaClick(): void {
    this.store.dispatch<MempoolBakingRightsDeltaSwitch>({ type: MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH });
  }
}
