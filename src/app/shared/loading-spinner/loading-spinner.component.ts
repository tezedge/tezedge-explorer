import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { spinnerActiveMessage } from '@shared/loading-spinner/loading-spinner.reducer';
import { LoadingSpinner } from '@shared/types/shared/loading-spinner/loading-spinner.type';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  host: { class: 'd-flex align-center' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent implements OnInit {

  spinner$: Observable<LoadingSpinner>;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.listenToLoading();
  }

  private listenToLoading(): void {
    this.spinner$ = this.store.select(spinnerActiveMessage).pipe(delay(0));
  }
}
