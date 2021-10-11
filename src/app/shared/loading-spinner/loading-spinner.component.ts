import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LoadingSpinnerService } from '@shared/loading-spinner/loading-spinner.service';
import { delay, Observable } from 'rxjs';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  host: { class: 'd-flex align-center' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent implements OnInit {

  loading$: Observable<boolean>;

  constructor(private loadingService: LoadingSpinnerService) { }

  ngOnInit(): void {
    this.listenToLoading();
  }

  private listenToLoading(): void {
    this.loading$ = this.loadingService.loadingSub.pipe(delay(0));
  }
}
