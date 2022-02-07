import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { editor, Range } from 'monaco-editor';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { filter } from 'rxjs';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import { SMART_CONTRACTS_START_DEBUGGING, SMART_CONTRACTS_STOP_DEBUGGING } from '@smart-contracts/smart-contracts/smart-contracts.actions';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import { SmartContractResult } from '@shared/types/smart-contracts/smart-contract-result.type';

@UntilDestroy()
@Component({
  selector: 'app-smart-contracts',
  templateUrl: './smart-contracts.component.html',
  styleUrls: ['./smart-contracts.component.scss']
})
export class SmartContractsComponent implements OnInit {

  readonly editorOptions = { theme: 'michelson-theme', language: 'michelson', readOnly: true };

  activeContract: SmartContract;
  result: SmartContractResult;
  activeLineCode = null;
  breakpointList = [];
  debugConfig: any = {
    previousStep: undefined,
    currentStep: undefined,
    nextStep: undefined,
    stepOut: undefined,
    stepIn: undefined
  };

  trace: any[];
  gasTrace: number[];

  private parent: HTMLDivElement;
  private editor: IStandaloneCodeEditor;
  private monacoDeltaDecorations: string[] = [];
  private highlightServerResponse: any;

  constructor(private store: Store<State>,
              private renderer: Renderer2,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {

    // First call indent, then typecheck or better get_trace
    // typecheck -> highlightServerResponse

    // TODO: check when going outside a step, is it the first parent taken?

    this.store
      .select('smartContracts')
      .pipe(filter(Boolean))
      .subscribe(smartContractState => {
        this.activeContract = smartContractState.activeContract;
        this.result = smartContractState.result;

        if (smartContractState.trace?.history[0].receipt.result.trace) {
          this.trace = smartContractState.trace.history[0].receipt.result.trace.filter(trace => !trace.location.expanded);
          const linesOfCode = Math.max(...this.trace.map(step => step.location.location.stop.line));
          this.gasTrace = new Array(linesOfCode).fill(0);
          const linesConsumingGas = this.trace.filter(step => step.location.location.start.line === step.location.location.stop.line);
          const gasArray = [];

          for (let i = 1; i <= linesOfCode; i++) {
            const step = linesConsumingGas.find(line => line.location.location.start.line === i);
            if (step) {
              gasArray.push({
                line: step.location.location.start.line,
                gas: step.gas
              });
            } else {
              let alternativeGas;
              if (gasArray.length === 0) {
                alternativeGas = linesConsumingGas[0].gas;
              } else {
                alternativeGas = gasArray[gasArray.length - 1].gas;
              }
              gasArray.push({
                line: i,
                gas: alternativeGas
              });
            }
          }

          this.gasTrace = gasArray.map((step, i) => {
            if (gasArray[i + 1]) {
              return Number(gasArray[i].gas) - Number(gasArray[i + 1].gas);
            }
            return 0;
          });

          this.cdRef.detectChanges();
        }
      });

  }

  onEditorInit(codeEditor: IStandaloneCodeEditor): void {
    this.editor = codeEditor;
    this.parent = document.querySelector('.view-overlays') as HTMLDivElement;
    this.editor.onDidChangeCursorPosition(e => {
      // this.getStackAtCurrentPosition(e.position.lineNumber, e.position.column); // now we postpone this functionality
    });
  }

  private getStackAtCurrentPosition(line: number, column: number): void {
    const clickedCharacterIndex = this.activeContract.code.split('\n', line - 1).join('\n').length + column;

    if (this.activeContract.code[clickedCharacterIndex] === ' ' && this.activeContract.code[clickedCharacterIndex - 1] === ' ') {
      this.activeLineCode = undefined;
      return;
    }

    const elements = this.highlightServerResponse.typemap
      .filter(
        elem => elem.location.location.start.point <= clickedCharacterIndex && elem.location.location.stop.point >= clickedCharacterIndex
      );
    const minimumToken = Math.min(...elements.map(elem => elem.location.location.stop.point - elem.location.location.start.point));
    const closestElement = elements.find(elem => elem.location.location.stop.point - elem.location.location.start.point === minimumToken);
    this.activeLineCode = !closestElement
      ? undefined
      : {
        before: closestElement.before,
        after: closestElement.after,
        line,
        column
      };
    this.cdRef.detectChanges();
  }

  toggleBreakpoint(i: number): void {
    // if (this.newCode[i].noBreakpoint) {
    //   return;
    // }

    const foundIndex = this.breakpointList.findIndex(idx => idx === i);

    const line = Array.from(this.parent.children)[i] as HTMLDivElement;
    const elementId = i + 'breakpoint';
    if (foundIndex !== -1) {
      this.breakpointList.splice(foundIndex, 1);
      document.getElementById(elementId).remove();
    } else {
      this.breakpointList.push(i);
      const newLine = this.renderer.createElement('div');
      newLine.id = elementId;

      this.renderer.setStyle(newLine, 'position', line.style.position);
      this.renderer.setStyle(newLine, 'width', line.style.width);
      this.renderer.setStyle(newLine, 'height', line.style.height);
      this.renderer.setStyle(newLine, 'top', line.style.top);
      this.renderer.addClass(newLine, 'breakpoint-line');
      this.renderer.appendChild(this.parent, newLine);
    }
  }

  startDebugger(): void {
    this.store.dispatch({ type: SMART_CONTRACTS_START_DEBUGGING });
    const firstDebuggingElementStartPoint = Math.min(...this.trace.map(t => t.location.location.start.point).filter(Boolean));
    const firstDebuggingElement = this.trace.find(t => t.location.location.start.point === firstDebuggingElementStartPoint);
    this.highlightCurrentDebuggingCode(firstDebuggingElement);
    this.manageNextActions(firstDebuggingElement);
    setTimeout(() => this.editor.layout(), 50);
    setTimeout(() => this.editor.layout(), 100);
    setTimeout(() => this.editor.layout(), 150);
    setTimeout(() => this.editor.layout(), 200);
    setTimeout(() => this.editor.layout(), 250);
    setTimeout(() => this.editor.layout(), 300);
  }

  stopDebugger(): void {
    this.store.dispatch({ type: SMART_CONTRACTS_STOP_DEBUGGING });
    this.monacoDeltaDecorations = this.editor.deltaDecorations(this.monacoDeltaDecorations, []);
    this.debugConfig = {
      previousStep: undefined,
      currentStep: undefined,
      nextStep: undefined,
      stepIn: undefined,
      stepOut: undefined
    };
    setTimeout(() => this.editor.layout(), 50);
    setTimeout(() => this.editor.layout(), 100);
    setTimeout(() => this.editor.layout(), 150);
    setTimeout(() => this.editor.layout(), 200);
    setTimeout(() => this.editor.layout(), 250);
    setTimeout(() => this.editor.layout(), 300);
  }

  nextStep(): void {
    this.highlightCurrentDebuggingCode(this.debugConfig.nextStep);
    this.manageNextActions(this.debugConfig.nextStep);
  }

  stepIn(): void {
    this.highlightCurrentDebuggingCode(this.debugConfig.stepIn);
    this.manageNextActions(this.debugConfig.stepIn);
  }

  stepOut(): void {
    this.highlightCurrentDebuggingCode(this.debugConfig.stepOut);
    this.manageNextActions(this.debugConfig.stepOut);
  }

  private manageNextActions(currentStep): void {
    this.debugConfig.currentStep = currentStep;
    const currentStepIndexInTrace = this.trace.findIndex(t => t === currentStep);
    this.debugConfig.previousStep = currentStepIndexInTrace !== -1 ? this.trace[currentStepIndexInTrace - 1] : undefined;
    const firstNextStepStartPoint = Math.min(...this.trace
      .filter(t => t.location.location.start.point > currentStep.location.location.stop.point)
      .map(t => t.location.location.start.point)
    );
    this.debugConfig.nextStep = this.trace.find(t => t.location.location.start.point === firstNextStepStartPoint);
    const stepsInsideCurrentStep: any[] = this.trace.filter(
      t => t.location.location.start.point > currentStep.location.location.start.point
        && t.location.location.stop.point < currentStep.location.location.stop.point
    );
    const firstStepInStartPoint = Math.min(...stepsInsideCurrentStep.map(t => t.location.location.start.point));
    this.debugConfig.stepIn = stepsInsideCurrentStep.find(t => t.location.location.start.point === firstStepInStartPoint);
    const stepsOutsideCurrentStep: any[] = this.trace.filter(
      t => t.location.location.start.point < currentStep.location.location.start.point
        && t.location.location.stop.point > currentStep.location.location.stop.point
    );
    const outsideStepStartPoint = Math.max(...stepsOutsideCurrentStep.map(t => t.location.location.start.point));
    this.debugConfig.stepOut = stepsOutsideCurrentStep.find(t => t.location.location.start.point === outsideStepStartPoint);
    this.cdRef.detectChanges();
  }

  private highlightCurrentDebuggingCode(newStep): void {
    const start = newStep.location.location.start;
    const stop = newStep.location.location.stop;
    const range = new Range(start.line, start.column + 1, stop.line, stop.column + 1);
    const options = { inlineClassName: 'debugging-highlight', hoverMessage: [{ value: 'Current line' }] };
    const newDecorations = [{ range, options }];
    this.monacoDeltaDecorations = this.editor.deltaDecorations(this.monacoDeltaDecorations, newDecorations);
  }
}

const contract = {
  code: 'parameter unit;\nstorage unit;\ncode { DROP;\n       SOURCE;\n       CONTRACT unit;\n       ASSERT_SOME;\n       PUSH mutez 300;\n       UNIT;\n       TRANSFER_TOKENS;\n       DIP { NIL operation };\n       CONS;\n       DIP { UNIT };\n       PAIR;\n       }',
  storage: 'Unit',
};
const contract2 = {
  code: 'parameter (or (or (int %decrement) (int %increment)) (unit %reset)) ;\nstorage int ;\ncode { UNPAIR ;\n       IF_LEFT { IF_LEFT { SWAP ; SUB } { ADD } } { DROP 2 ; PUSH int 0 } ;\n       NIL operation ;\n       PAIR }',
  storage: '11',
};

