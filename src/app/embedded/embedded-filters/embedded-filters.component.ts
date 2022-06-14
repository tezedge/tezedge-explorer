import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EmbeddedState, selectEmbeddedState } from '@app/embedded/embedded.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import {
  EMBEDDED_CHANGE_PAGE,
  EMBEDDED_CHANGE_STREAM,
  EmbeddedChangePage,
  EmbeddedChangeStream
} from '@app/embedded/embedded.actions';

@UntilDestroy()
@Component({
  selector: 'app-embedded-filters',
  templateUrl: './embedded-filters.component.html',
  styleUrls: ['./embedded-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmbeddedFiltersComponent implements OnInit {

  state: EmbeddedState;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listenToEmbeddedStateChanges();
  }

  private listenToEmbeddedStateChanges(): void {
    this.store.select(selectEmbeddedState)
      .pipe(untilDestroyed(this))
      .subscribe((state: EmbeddedState) => {
        this.state = state;
        this.cdRef.detectChanges();
      });
  }

  startStream(): void {
    if (!this.state.stream) {
      this.store.dispatch<EmbeddedChangeStream>({ type: EMBEDDED_CHANGE_STREAM, payload: true });
    }
  }

  stopStream(): void {
    if (this.state.stream) {
      this.store.dispatch<EmbeddedChangeStream>({ type: EMBEDDED_CHANGE_STREAM, payload: false });
    }
  }

  loadPreviousPage(): void {
    this.store.dispatch<EmbeddedChangePage>({ type: EMBEDDED_CHANGE_PAGE, payload: this.state.activePageIndex - 1 });
  }

  loadNextPage(): void {
    this.store.dispatch<EmbeddedChangePage>({ type: EMBEDDED_CHANGE_PAGE, payload: this.state.activePageIndex + 1 });
  }
}
