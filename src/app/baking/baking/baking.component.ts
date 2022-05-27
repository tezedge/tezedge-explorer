import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { BAKING_INIT, BAKING_STOP, BakingInit, BakingStop } from '@baking/baking.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BakingState, selectBakingState } from '@baking/baking.index';
import { filter } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-baking',
  templateUrl: './baking.component.html',
  styleUrls: ['./baking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BakingComponent implements OnInit, OnDestroy {

  state: BakingState;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.dispatch<BakingInit>({ type: BAKING_INIT });
    this.listenToBakingChanges();
  }

  ngOnDestroy(): void {
    this.store.dispatch<BakingStop>({ type: BAKING_STOP });
  }

  private listenToBakingChanges(): void {
    this.store.select(selectBakingState).pipe(
      untilDestroyed(this),
      filter(state => state.bakers.length > 0)
    ).subscribe(state => {
      this.state = state;
      this.cdRef.detectChanges();
    });
  }
}
