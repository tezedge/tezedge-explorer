import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { selectSmartContractsActiveContract } from '@smart-contracts/smart-contracts/smart-contracts.reducer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SMART_CONTRACTS_RUN } from '@smart-contracts/smart-contracts/smart-contracts.actions';
import { filter } from 'rxjs/operators';
import { SmartContractResult } from '@shared/types/smart-contracts/smart-contract-result.type';

@UntilDestroy()
@Component({
  selector: 'app-smart-contracts-run',
  templateUrl: './smart-contracts-run.component.html',
  styleUrls: ['./smart-contracts-run.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartContractsRunComponent implements OnInit {

  contract: SmartContract;
  formGroup: FormGroup;

  constructor(private store: Store<State>,
              private formBuilder: FormBuilder,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initForm();
    this.listenToActiveContractChanges();
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      parameter: new FormControl(),
      storage: new FormControl()
    });
  }

  private listenToActiveContractChanges(): void {
    this.store.select(selectSmartContractsActiveContract)
      .pipe(
        untilDestroyed(this),
        filter(Boolean)
      )
      .subscribe((contract: SmartContract) => {
        this.contract = contract;
        this.formGroup.get('storage').patchValue(contract.codeParameter ? contract.codeParameter[0] : 'Unit');
        this.formGroup.get('parameter').patchValue(contract.codeParameter ? contract.codeParameter[1] : 'Unit');
        this.cdRef.detectChanges();
      });
  }

  runContract(): void {
    this.store.dispatch({
      type: SMART_CONTRACTS_RUN,
      payload: {
        ...this.contract,
        codeParameter: [this.formGroup.get('storage').value, this.formGroup.get('parameter').value]
      }
    });
  }
}
