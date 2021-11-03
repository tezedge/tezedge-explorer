import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { filter } from 'rxjs';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import {
  SMART_CONTRACTS_DEBUG_STEP,
  SMART_CONTRACTS_START_DEBUGGING,
  SMART_CONTRACTS_STOP,
  SMART_CONTRACTS_STOP_DEBUGGING,
  SmartContractsDebugStepAction,
  SmartContractsStopAction
} from '@smart-contracts/smart-contracts/smart-contracts.actions';
import { DOCUMENT } from '@angular/common';
import { SmartContractTrace } from '@shared/types/smart-contracts/smart-contract-trace.type';
import { SmartContractsDebugConfig } from '@shared/types/smart-contracts/smart-contracts-debug-config.type';

@UntilDestroy()
@Component({
  selector: 'app-smart-contracts',
  templateUrl: './smart-contracts.component.html',
  styleUrls: ['./smart-contracts.component.scss']
})
export class SmartContractsComponent implements OnInit, OnDestroy {

  activeContract: SmartContract;
  activeLineCode = null;
  debugConfig: SmartContractsDebugConfig = {
    previousStep: undefined,
    currentStep: undefined,
    nextStep: undefined,
    stepOut: undefined,
    stepIn: undefined
  };

  trace: SmartContractTrace[];
  gasTrace: number[];

  scrolledCode: string = '0px';

  constructor(private store: Store<State>,
              private renderer2: Renderer2,
              private cdRef: ChangeDetectorRef,
              @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    this.listenToSmartContractsChange();
  }

  private listenToSmartContractsChange(): void {
    // First call indent, then typecheck or better get_trace
    // typecheck -> highlightServerResponse

    // TODO: check when going outside a step, is it the first parent taken?

    this.store
      .select('smartContracts')
      .pipe(filter(Boolean))
      .subscribe(smartContractState => {
        this.activeContract = smartContractState.activeContract;
        this.trace = smartContractState.trace;
        this.gasTrace = smartContractState.gasTrace;
        this.debugConfig = smartContractState.debugConfig;
        this.cdRef.detectChanges();
      });
  }

  startDebugger(): void {
    this.store.dispatch({ type: SMART_CONTRACTS_START_DEBUGGING });
    // TODO: start debugging should have logic in reducer to get first element and have an effect to dispatch "next-step" as first step
    const firstDebuggingElementStartPoint = Math.min(...this.trace.map(t => t.start.point).filter(Boolean));
    const firstDebuggingElement = this.trace[0];
    this.manageNextActions(firstDebuggingElement);
  }

  stopDebugger(): void {
    this.store.dispatch({ type: SMART_CONTRACTS_STOP_DEBUGGING });
  }

  nextStep(): void {
    this.manageNextActions(this.debugConfig.nextStep);
  }

  stepIn(): void {
    this.manageNextActions(this.debugConfig.stepIn);
  }

  stepOut(): void {
    this.manageNextActions(this.debugConfig.stepOut);
  }

  private manageNextActions(currentStep: SmartContractTrace): void {
    this.store.dispatch<SmartContractsDebugStepAction>({ type: SMART_CONTRACTS_DEBUG_STEP, payload: currentStep });
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.store.dispatch<SmartContractsStopAction>({ type: SMART_CONTRACTS_STOP });
  }
}
