import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ADD_INFO, InfoAdd } from '@shared/components/error-popup/error-popup.actions';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { MempoolBlockDetails } from '@shared/types/mempool/common/mempool-block-details.type';
import { UntilDestroy } from '@ngneat/until-destroy';

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

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.colors = this.isBlockApplication ? ['#ff9f0acc', '#ffd60acc', '#32d74bcc', '#bf5af2cc'] : [];
  }

  copyHashToClipboard(hash: string): void {
    this.store.dispatch<InfoAdd>({ type: ADD_INFO, payload: 'Copied to clipboard: ' + hash });
  }
}
