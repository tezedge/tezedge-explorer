import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BakingState, selectBakingState } from '@baking/baking.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import {
  BAKING_CHANGE_PAGE,
  BAKING_CHANGE_STREAM,
  BakingChangePage,
  BakingChangeStream
} from '@app/baking/baking.actions';

@UntilDestroy()
@Component({
  selector: 'app-baking-filters',
  templateUrl: './baking-filters.component.html',
  styleUrls: ['./baking-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BakingFiltersComponent implements OnInit {

  state: BakingState;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listenToBakingStateChanges();
  }

  private listenToBakingStateChanges(): void {
    this.store.select(selectBakingState)
      .pipe(untilDestroyed(this))
      .subscribe((state: BakingState) => {
        this.state = state;
        this.cdRef.detectChanges();
      });
  }

  startStream(): void {
    if (!this.state.stream) {
      this.store.dispatch<BakingChangeStream>({ type: BAKING_CHANGE_STREAM, payload: true });
    }
  }

  stopStream(): void {
    if (this.state.stream) {
      this.store.dispatch<BakingChangeStream>({ type: BAKING_CHANGE_STREAM, payload: false });
    }
  }

  loadPreviousPage(): void {
    this.store.dispatch<BakingChangePage>({ type: BAKING_CHANGE_PAGE, payload: this.state.activePageIndex - 1 });
  }

  loadNextPage(): void {
    this.store.dispatch<BakingChangePage>({ type: BAKING_CHANGE_PAGE, payload: this.state.activePageIndex + 1 });
  }
}
