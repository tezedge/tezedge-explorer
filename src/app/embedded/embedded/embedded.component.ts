import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { EMBEDDED_INIT, EmbeddedInit } from '@app/embedded/embedded.actions';
import { selectEmbeddedStateActivePage } from '@app/embedded/embedded.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EmbeddedPage } from '@shared/types/embedded/embedded-page.type';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { EmbeddedQuorum } from '@shared/types/embedded/embedded-quorum.type';

@UntilDestroy()
@Component({
  selector: 'app-embedded',
  templateUrl: './embedded.component.html',
  styleUrls: ['./embedded.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmbeddedComponent implements OnInit {

  state: EmbeddedPage;
  bakersList: { name: string, value: any }[] = [];
  prequorum: Partial<EmbeddedQuorum>;
  quorum: Partial<EmbeddedQuorum>;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.dispatch<EmbeddedInit>({ type: EMBEDDED_INIT });
    this.listenToEmbeddedStateChanges();
  }

  private listenToEmbeddedStateChanges(): void {
    this.store.select(selectEmbeddedStateActivePage)
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged(),
        filter(Boolean)
      )
      .subscribe((state: EmbeddedPage) => {
        this.state = state;
        this.bakersList = Object.keys(state.bakers).map(key => ({ name: key, value: state.bakers[key] }));
        this.prequorum = { notified: state.prequorum.notified, delegates: state.prequorum.delegates };
        this.quorum = { notified: state.quorum.notified, delegates: state.quorum.delegates };
        this.cdRef.detectChanges();
      });
  }
}
