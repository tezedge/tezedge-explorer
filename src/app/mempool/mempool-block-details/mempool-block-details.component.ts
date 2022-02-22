import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ADD_INFO, InfoAdd } from '@shared/components/error-popup/error-popup.actions';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { MempoolBlockDetails } from '@shared/types/mempool/common/mempool-block-details.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { mempoolBlockApplication } from '@mempool/mempool-block-application/mempool-block-application.reducer';
import { take } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-mempool-block-details',
  templateUrl: './mempool-block-details.component.html',
  styleUrls: ['./mempool-block-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolBlockDetailsComponent implements OnInit {

  @Input() detail: MempoolBlockDetails;
  @Input() delta: boolean;
  @Input() isBlockApplication: boolean;

  colors: string[];

  readonly FIFTY_MS = 50000000;
  readonly TWENTY_MS = 20000000;

  constructor(private store: Store<State>,
              private router: Router) { }

  ngOnInit(): void {
    if (this.isBlockApplication) {
      this.store.select(mempoolBlockApplication)
        .pipe(untilDestroyed(this), take(1))
        .subscribe(state => {
          this.colors = state.colorScheme.slice(1).map(color => color + 'cc'); // darker
        });
    }
  }

  copyHashToClipboard(hash: string): void {
    this.store.dispatch<InfoAdd>({ type: ADD_INFO, payload: 'Copied to clipboard: ' + hash });
  }

  navigateToNetwork(timestamp: number): void {
    this.router.navigate(['network'], {
      queryParams: { timestamp: Math.ceil(timestamp / 1000000) },
      queryParamsHandling: 'merge'
    });
  }
}
