import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SmartContractResult } from '@shared/types/smart-contracts/smart-contract-result.type';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { selectSmartContractsResult } from '@smart-contracts/smart-contracts/smart-contracts.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-smart-contracts-result',
  templateUrl: './smart-contracts-result.component.html',
  styleUrls: ['./smart-contracts-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartContractsResultComponent implements OnInit {

  failCause: string;
  result: SmartContractResult;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listenToResultChanges();
  }

  private listenToResultChanges(): void {
    this.store.select(selectSmartContractsResult)
      .pipe(
        untilDestroyed(this),
        filter(Boolean)
      )
      .subscribe((result: SmartContractResult) => {
        this.result = result;
        if (Array.isArray(result.executionInfo)) {
          const failCauseWith = result.executionInfo?.find(r => r.with)?.with;
          if (failCauseWith) {
            this.failCause = Object.keys(failCauseWith)[0] + ' ' + Object.values(failCauseWith)[0].toString();
          } else {
            this.failCause = 'Failed';
          }
        } else {
          this.failCause = undefined;
        }
        this.cdRef.detectChanges();
      });
  }

}
