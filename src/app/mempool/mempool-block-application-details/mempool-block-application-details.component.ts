import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, tap } from 'rxjs';
import { MempoolBlockDetails } from '@shared/types/mempool/common/mempool-block-details.type';
import {
  mempoolBlockApplicationActiveBlockDetails,
  mempoolBlockApplicationActiveBlockLevel,
  mempoolBlockApplicationDelta
} from '@mempool/mempool-block-application/mempool-block-application.reducer';
import {
  MEMPOOL_BLOCK_APPLICATION_DELTA_SWITCH,
  MempoolBlockApplicationDeltaSwitch
} from '@mempool/mempool-block-application/mempool-block-application.actions';

@UntilDestroy()
@Component({
  selector: 'app-mempool-block-application-details',
  templateUrl: './mempool-block-application-details.component.html',
  styleUrls: ['./mempool-block-application-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolBlockApplicationDetailsComponent implements OnInit {

  details$: Observable<MempoolBlockDetails[]>;
  blockLevel$: Observable<number>;
  delta: boolean;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.listenToDetailsChanges();
  }

  private listenToDetailsChanges(): void {
    this.details$ = this.store.select(mempoolBlockApplicationActiveBlockDetails);
    this.blockLevel$ = this.store.select(mempoolBlockApplicationActiveBlockLevel);
    this.store.select(mempoolBlockApplicationDelta)
      .pipe(untilDestroyed(this))
      .subscribe(val => this.delta = val);
  }

  onDeltaClick(): void {
    this.store.dispatch<MempoolBlockApplicationDeltaSwitch>({ type: MEMPOOL_BLOCK_APPLICATION_DELTA_SWITCH });
  }
}
