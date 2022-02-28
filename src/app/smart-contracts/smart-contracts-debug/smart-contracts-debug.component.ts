import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  selectSmartContractsActiveContract,
  selectSmartContractsDebugConfig,
  selectSmartContractsTrace
} from '@smart-contracts/smart-contracts/smart-contracts.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { SmartContractTrace } from '@shared/types/smart-contracts/smart-contract-trace.type';
import { SmartContractsDebugConfig } from '@shared/types/smart-contracts/smart-contracts-debug-config.type';
import {
  SMART_CONTRACTS_DEBUG_STEP,
  SMART_CONTRACTS_START_DEBUGGING,
  SMART_CONTRACTS_STOP_DEBUGGING,
  SmartContractsDebugStepAction
} from '@smart-contracts/smart-contracts/smart-contracts.actions';

@UntilDestroy()
@Component({
  selector: 'app-smart-contracts-debug',
  templateUrl: './smart-contracts-debug.component.html',
  styleUrls: ['./smart-contracts-debug.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartContractsDebugComponent implements OnInit {

  activeContract: SmartContract;
  trace: SmartContractTrace[];
  debugConfig: SmartContractsDebugConfig = {
    currentStep: null,
    previousStep: null,
    nextStep: null,
    stepOver: null,
    stepIn: null,
    stepOut: null
  };

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listenToActiveContractChanges();
    this.listenToTraceChanges();
    this.listenToDebugChanges();
  }

  private listenToActiveContractChanges(): void {
    this.store.select(selectSmartContractsActiveContract)
      .pipe(
        untilDestroyed(this),
        filter(Boolean)
      )
      .subscribe((contract: SmartContract) => {
        this.activeContract = contract;
        this.cdRef.detectChanges();
      });
  }

  private listenToTraceChanges(): void {
    this.store.select(selectSmartContractsTrace)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((trace: SmartContractTrace[]) => {
        this.trace = trace;
      });
  }

  private listenToDebugChanges(): void {
    this.store.select(selectSmartContractsDebugConfig)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((debugConfig: SmartContractsDebugConfig) => {
        this.debugConfig = debugConfig;
      });
  }

  startDebugger(): void {
    this.store.dispatch({ type: SMART_CONTRACTS_START_DEBUGGING });
    // TODO: start debugging should have logic in reducer to get first element and have an effect to dispatch "next-step" as first step
    const firstDebuggingElement = this.trace[0];
    this.manageNextActions(firstDebuggingElement);
  }

  stopDebugger(): void {
    this.store.dispatch({ type: SMART_CONTRACTS_STOP_DEBUGGING });
  }

  step(step: SmartContractTrace): void {
    this.manageNextActions(step);
  }

  private manageNextActions(currentStep: SmartContractTrace): void {
    this.store.dispatch<SmartContractsDebugStepAction>({ type: SMART_CONTRACTS_DEBUG_STEP, payload: currentStep });
    this.cdRef.detectChanges();
  }

}
