import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { spinnerActiveMessage } from '@shared/components/loading-spinner/loading-spinner.reducer';
import { LoadingSpinner } from '@shared/types/shared/loading-spinner/loading-spinner.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent implements OnInit {

  spinner: LoadingSpinner;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listenToLoading();
  }

  private listenToLoading(): void {
    this.store.select(spinnerActiveMessage).pipe(
      // delay(0),
      untilDestroyed(this)
    ).subscribe(spinner => {
      this.spinner = spinner;
      this.cdRef.detectChanges();
    });
  }
}
