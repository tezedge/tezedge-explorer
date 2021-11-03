import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { delay, filter, fromEvent, merge } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { editor, Range } from 'monaco-editor';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SmartContractResult } from '@shared/types/smart-contracts/smart-contract-result.type';
import { SmartContractsDebugConfig } from '@shared/types/smart-contracts/smart-contracts-debug-config.type';
import { SmartContractTrace } from '@shared/types/smart-contracts/smart-contract-trace.type';
import { selectSmartContractsDebugConfig, selectSmartContractsIsDebugging, SmartContractsState } from '@smart-contracts/smart-contracts/smart-contracts.index';
import { debounce } from 'typescript-debounce-decorator';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

@UntilDestroy()
@Component({
  selector: 'app-smart-contracts-code',
  templateUrl: './smart-contracts-code.component.html',
  styleUrls: ['./smart-contracts-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartContractsCodeComponent implements OnInit {

  readonly editorOptions = { theme: 'michelson-theme', language: 'michelson', readOnly: true };

  activeContract: SmartContract;
  result: SmartContractResult;
  activeLineCode = null;
  breakpointList = [];
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

  private parent: HTMLDivElement;
  private editor: IStandaloneCodeEditor;
  private monacoDeltaDecorations: string[] = [];
  private highlightServerResponse: any;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private renderer2: Renderer2,
              @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    this.store
      .select('smartContracts')
      .pipe(
        untilDestroyed(this),
      )
      .subscribe((smartContractState: SmartContractsState) => {
        this.activeContract = smartContractState.activeContract;
        this.trace = smartContractState.trace;
        this.gasTrace = smartContractState.gasTrace;
        this.cdRef.detectChanges();
      });

    this.store
      .select(selectSmartContractsDebugConfig)
      .pipe(
        untilDestroyed(this),
        filter(config => !!config.currentStep)
      )
      .subscribe((debugConfig: SmartContractsDebugConfig) => {
        this.debugConfig = debugConfig;
        this.highlightCurrentDebuggingCode(debugConfig.currentStep);
        setTimeout(() => this.editor.layout(), 50);
        setTimeout(() => this.editor.layout(), 100);
        setTimeout(() => this.editor.layout(), 150);
        setTimeout(() => this.editor.layout(), 200);
        setTimeout(() => this.editor.layout(), 250);
        setTimeout(() => this.editor.layout(), 300);
        this.cdRef.detectChanges();
      });

    this.store
      .select(selectSmartContractsIsDebugging)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((isDebugging: boolean) => {
        if (!isDebugging && this.editor) {
          this.monacoDeltaDecorations = this.editor.deltaDecorations(this.monacoDeltaDecorations, []);
        }
        this.cdRef.detectChanges();
      });
  }

  onEditorInit(codeEditor: IStandaloneCodeEditor): void {
    this.editor = codeEditor;
    // TODO: Parent unused right now. Future feature.
    this.parent = this.document.querySelector('.view-overlays') as HTMLDivElement;
    this.editor.onDidChangeCursorPosition(e => {
      // this.getStackAtCurrentPosition(e.position.lineNumber, e.position.column); // now we postpone this functionality
    });
    this.listenToCodeScrolling();
  }

  private listenToCodeScrolling(): void {
    const lineNumberContainer = this.document.querySelector('ngx-monaco-editor .monaco-editor .margin') as HTMLDivElement;
    const monacoScrollableElement = this.document.querySelector('ngx-monaco-editor .monaco-editor .overflow-guard');
    const minimap = this.document.querySelector('ngx-monaco-editor .minimap-decorations-layer');
    const minimapSlider = this.document.querySelector('ngx-monaco-editor .minimap-slider-horizontal');
    merge(
      fromEvent(monacoScrollableElement, 'mousewheel'),
      fromEvent(monacoScrollableElement, 'touchend'),
      fromEvent(minimap, 'click'),
      fromEvent(minimapSlider, 'drag'),
    ).pipe(
      untilDestroyed(this),
      filter(() => !!this.debugConfig.currentStep),
      delay(5)
    ).subscribe(() => {
      // TODO: add here a logic after last event came hit again this (use throttle on a method)
      this.scrolledCode = lineNumberContainer.style.top;
      this.checkScrolledCode(lineNumberContainer);
      this.cdRef.detectChanges();
    });
  }

  @debounce(50)
  private checkScrolledCode(lineNumberContainer: HTMLDivElement): void {
    this.scrolledCode = lineNumberContainer.style.top;
    setTimeout(() => {
      this.scrolledCode = lineNumberContainer.style.top;
      this.cdRef.detectChanges();
    }, 50);
  }

  private highlightCurrentDebuggingCode(newStep: SmartContractTrace): void {
    const start = newStep.start;
    const stop = newStep.stop;
    const range = new Range(start.line, start.column, stop.line, stop.column);
    const options = { inlineClassName: 'debugging-highlight', hoverMessage: [{ value: 'Current line' }] };
    const newDecorations = [{ range, options }];
    this.monacoDeltaDecorations = this.editor.deltaDecorations(this.monacoDeltaDecorations, newDecorations);
  }

  private getStackAtCurrentPosition(line: number, column: number): void {
    /*const clickedCharacterIndex = this.activeContract.code.split('\n', line - 1).join('\n').length + column;

    if (this.activeContract.code[clickedCharacterIndex] === ' ' && this.activeContract.code[clickedCharacterIndex - 1] === ' ') {
      this.activeLineCode = undefined;
      return;
    }

    const elements = this.highlightServerResponse.typemap
      .filter(
        elem => elem.start.point <= clickedCharacterIndex && elem.stop.point >= clickedCharacterIndex
      );
    const minimumToken = Math.min(...elements.map(elem => elem.stop.point - elem.start.point));
    const closestElement = elements.find(elem => elem.stop.point - elem.start.point === minimumToken);
    this.activeLineCode = !closestElement
      ? undefined
      : {
        before: closestElement.before,
        after: closestElement.after,
        line,
        column
      };
    this.cdRef.detectChanges();*/
  }

  // TODO: Unused right now. Future feature.
  toggleBreakpoint(i: number): void {
    return;
    // if (this.newCode[i].noBreakpoint) {
    //   return;
    // }
    /*
    const foundIndex = this.breakpointList.findIndex(idx => idx === i);
     const line = Array.from(this.parent.children)[i] as HTMLDivElement;
    const elementId = i + 'breakpoint';
    if (foundIndex !== -1) {
      this.breakpointList.splice(foundIndex, 1);
      this.document.getElementById(elementId).remove();
    } else {
      this.breakpointList.push(i);
      const newLine = this.renderer2.createElement('div');
      newLine.id = elementId;
       this.renderer2.setStyle(newLine, 'position', line.style.position);
      this.renderer2.setStyle(newLine, 'width', line.style.width);
      this.renderer2.setStyle(newLine, 'height', line.style.height);
      this.renderer2.setStyle(newLine, 'top', line.style.top);
      this.renderer2.addClass(newLine, 'breakpoint-line');
      this.renderer2.appendChild(this.parent, newLine);
    }*/
  }

  // onEditorInit(codeEditor: IStandaloneCodeEditor): void {
  //   this.editor = codeEditor;
  //   // TODO: Parent unused right now. Future feature.
  //   this.parent = this.document.querySelector('.view-overlays') as HTMLDivElement;
  //   this.editor.onDidChangeCursorPosition(e => {
  //     // this.getStackAtCurrentPosition(e.position.lineNumber, e.position.column); // now we postpone this functionality
  //   });
  //   this.listenToCodeScrolling();
  // }
  //
  // private listenToCodeScrolling(): void {
  //   const lineNumberContainer = this.document.querySelector('ngx-monaco-editor .monaco-editor .margin') as HTMLDivElement;
  //   const monacoScrollableElement = this.document.querySelector('ngx-monaco-editor .monaco-editor .monaco-scrollable-element');
  //   merge(
  //     fromEvent(monacoScrollableElement, 'mousewheel'),
  //     fromEvent(monacoScrollableElement, 'touchend')
  //   ).pipe(
  //     untilDestroyed(this),
  //     throttleTime(100)
  //   ).subscribe(() => {
  //     this.scrolledCode = lineNumberContainer.style.top;
  //     console.log(this.scrolledCode);
  //   });
  // }

  // private getStackAtCurrentPosition(line: number, column: number): void {
  //   const clickedCharacterIndex = this.activeContract.code.split('\n', line - 1).join('\n').length + column;
  //
  //   if (this.activeContract.code[clickedCharacterIndex] === ' ' && this.activeContract.code[clickedCharacterIndex - 1] === ' ') {
  //     this.activeLineCode = undefined;
  //     return;
  //   }
  //
  //   const elements = this.highlightServerResponse.typemap
  //     .filter(
  //       elem => elem.start.point <= clickedCharacterIndex && elem.stop.point >= clickedCharacterIndex
  //     );
  //   const minimumToken = Math.min(...elements.map(elem => elem.stop.point - elem.start.point));
  //   const closestElement = elements.find(elem => elem.stop.point - elem.start.point === minimumToken);
  //   this.activeLineCode = !closestElement
  //     ? undefined
  //     : {
  //       before: closestElement.before,
  //       after: closestElement.after,
  //       line,
  //       column
  //     };
  //   this.cdRef.detectChanges();
  // }

  // TODO: Unused right now. Future feature.
  // toggleBreakpoint(i: number): void {
  //   return;
  //   // if (this.newCode[i].noBreakpoint) {
  //   //   return;
  //   // }
  //
  //   const foundIndex = this.breakpointList.findIndex(idx => idx === i);
  //
  //   const line = Array.from(this.parent.children)[i] as HTMLDivElement;
  //   const elementId = i + 'breakpoint';
  //   if (foundIndex !== -1) {
  //     this.breakpointList.splice(foundIndex, 1);
  //     this.document.getElementById(elementId).remove();
  //   } else {
  //     this.breakpointList.push(i);
  //     const newLine = this.renderer2.createElement('div');
  //     newLine.id = elementId;
  //
  //     this.renderer2.setStyle(newLine, 'position', line.style.position);
  //     this.renderer2.setStyle(newLine, 'width', line.style.width);
  //     this.renderer2.setStyle(newLine, 'height', line.style.height);
  //     this.renderer2.setStyle(newLine, 'top', line.style.top);
  //     this.renderer2.addClass(newLine, 'breakpoint-line');
  //     this.renderer2.appendChild(this.parent, newLine);
  //   }
  // }
}
