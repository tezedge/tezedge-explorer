import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { Observable } from 'rxjs';
import { MempoolBlockDetails } from '@shared/types/mempool/common/mempool-block-details.type';
import { mempoolBakingRightsDelta, mempoolBakingRightsDetails } from '@mempool/mempool-baking-rights/mempool-baking-rights.reducer';
import { ADD_INFO, InfoAdd } from '@shared/components/error-popup/error-popup.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH, MempoolBakingRightsDeltaSwitch } from '@mempool/mempool-baking-rights/mempool-baking-rights.actions';

@UntilDestroy()
@Component({
  selector: 'app-mempool-baking-rights-details',
  templateUrl: './mempool-baking-rights-details.component.html',
  styleUrls: ['./mempool-baking-rights-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolBakingRightsDetailsComponent implements OnInit {

  details$: Observable<MempoolBlockDetails[]>;
  delta: boolean;

  constructor(private store: Store<State>) { }

  readonly trackDetails = (index: number, detail: MempoolBlockDetails) => detail.baker;

  ngOnInit(): void {
    this.listenToDetailsChanges();
  }

  private listenToDetailsChanges(): void {
    this.details$ = this.store.select(mempoolBakingRightsDetails);
    this.store.select(mempoolBakingRightsDelta)
      .pipe(untilDestroyed(this))
      .subscribe(val => this.delta = val);
  }

  copyHashToClipboard(hash: string): void {
    this.store.dispatch<InfoAdd>({ type: ADD_INFO, payload: 'Copied to clipboard: ' + hash });
  }

  onDeltaClick(): void {
    this.store.dispatch<MempoolBakingRightsDeltaSwitch>({ type: MEMPOOL_BAKING_RIGHTS_DELTA_SWITCH });
  }
}
