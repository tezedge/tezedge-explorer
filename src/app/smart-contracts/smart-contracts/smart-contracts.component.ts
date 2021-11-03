import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import { SMART_CONTRACTS_STOP, SmartContractsStopAction } from '@smart-contracts/smart-contracts/smart-contracts.actions';
import { selectSmartContractsActiveContract, selectSmartContractsResult } from '@smart-contracts/smart-contracts/smart-contracts.index';
import { filter } from 'rxjs/operators';
import { SmartContractResult } from '@shared/types/smart-contracts/smart-contract-result.type';

@UntilDestroy()
@Component({
  selector: 'app-smart-contracts',
  templateUrl: './smart-contracts.component.html',
  styleUrls: ['./smart-contracts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartContractsComponent implements OnInit, OnDestroy {

  readonly tabs = ['debug', 'result', 'inputs'];
  activeTab = 'debug';

  activeContract: SmartContract;
  activeContractFailed: boolean;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listenToSmartContractsChange();
    this.selectSmartContractsResult();
  }

  private listenToSmartContractsChange(): void {
    this.store
      .select(selectSmartContractsActiveContract)
      .pipe(untilDestroyed(this))
      .subscribe(activeContract => {
        this.activeContract = activeContract;
        this.cdRef.detectChanges();
      });
  }

  private selectSmartContractsResult(): void {
    this.store.select(selectSmartContractsResult)
      .pipe(
        untilDestroyed(this),
        filter(Boolean)
      )
      .subscribe((result: SmartContractResult) => {
        this.activeContractFailed = Array.isArray(result.executionInfo);
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch<SmartContractsStopAction>({ type: SMART_CONTRACTS_STOP });
  }
}
