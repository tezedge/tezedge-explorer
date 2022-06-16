import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { BAKING_INIT, BakingInit } from '@app/baking/baking.actions';
import { selectBakingStateActivePage } from '@baking/baking.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BakingPage } from '@shared/types/baking/baking-page.type';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { BakingQuorum } from '@shared/types/baking/baking-quorum.type';

@UntilDestroy()
@Component({
  selector: 'app-baking',
  templateUrl: './baking.component.html',
  styleUrls: ['./baking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BakingComponent implements OnInit {

  state: BakingPage;
  bakersList: { name: string, value: any }[] = [];
  prequorum: Partial<BakingQuorum>;
  quorum: Partial<BakingQuorum>;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.dispatch<BakingInit>({ type: BAKING_INIT });
    this.listenToBakingStateChanges();
  }

  private listenToBakingStateChanges(): void {
    this.store.select(selectBakingStateActivePage)
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged(),
        filter(Boolean)
      )
      .subscribe((state: BakingPage) => {
        this.state = state;
        this.bakersList = Object.keys(state.bakers).map(key => ({ name: key, value: state.bakers[key] }));
        this.prequorum = { notified: state.prequorum.notified, delegates: state.prequorum.delegates };
        this.quorum = { notified: state.quorum.notified, delegates: state.quorum.delegates };
        this.cdRef.detectChanges();
      });
  }
}
