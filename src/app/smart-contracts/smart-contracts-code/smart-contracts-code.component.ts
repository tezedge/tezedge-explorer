import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { filter } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { editor, Range } from 'monaco-editor';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SmartContractsDebugConfig } from '@shared/types/smart-contracts/smart-contracts-debug-config.type';
import { SmartContractTrace } from '@shared/types/smart-contracts/smart-contract-trace.type';
import {
  selectSmartContractsActiveContract,
  selectSmartContractsDebugConfig,
  selectSmartContractsGasTrace,
  selectSmartContractsIsDebugging
} from '@smart-contracts/smart-contracts/smart-contracts.index';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;

@UntilDestroy()
@Component({
  selector: 'app-smart-contracts-code',
  templateUrl: './smart-contracts-code.component.html',
  styleUrls: ['./smart-contracts-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartContractsCodeComponent implements OnInit {

  editorOptions: IStandaloneEditorConstructionOptions = {
    autoDetectHighContrast: true,
    theme: 'michelson-theme',
    language: 'michelson',
    readOnly: true,
    lineNumbers: (lineNumber: number) => {
      const gas = this.gasTrace[lineNumber - 1];
      return (gas ? `<span ${gas > 100 ? 'class="text-red"' : (gas > 50 ? 'class="text-yellow"' : '')}>${gas}</span>` : `<span></span>`)
        + ' '
        + `<span class="line">` + lineNumber + `</span>`;
    },
    lineNumbersMinChars: 10,
    selectOnLineNumbers: false,
  };

  activeContractCode: string;

  private gasTrace: number[];

  private parent: HTMLDivElement;
  private editor: IStandaloneCodeEditor;
  private monacoDeltaDecorations: string[] = [];
  private highlightServerResponse: any;

  // activeLineCode = null;
  // breakpointList = [];

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private renderer2: Renderer2,
              @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    this.listenToActiveContractChanges();
    this.listenToGasTraceChange();
    this.listenToDebugConfigChange();
    this.listenToIsDebuggingChange();
  }

  private listenToDebugConfigChange() {
    this.store
      .select(selectSmartContractsDebugConfig)
      .pipe(
        untilDestroyed(this),
        filter(config => !!config.currentStep)
      )
      .subscribe((debugConfig: SmartContractsDebugConfig) => {
        if (this.editor) {
          this.highlightCurrentDebuggingCode(debugConfig.currentStep);
        }
      });
  }

  private listenToIsDebuggingChange(): void {
    this.store
      .select(selectSmartContractsIsDebugging)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((isDebugging: boolean) => {
        if (!isDebugging && this.editor) {
          this.monacoDeltaDecorations = this.editor.deltaDecorations(this.monacoDeltaDecorations, []);
        }
      });
  }

  private listenToGasTraceChange(): void {
    this.store
      .select(selectSmartContractsGasTrace)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe((gasTrace: number[]) => {
        this.gasTrace = gasTrace;
        this.editorOptions = {
          ...this.editorOptions,
          lineNumbersMinChars: this.gasTrace.length.toString().length + 1 + Math.max(...this.gasTrace).toString().length
        };
      });
  }

  private listenToActiveContractChanges(): void {
    this.store.select(selectSmartContractsActiveContract)
      .pipe(
        untilDestroyed(this),
        filter(Boolean)
      )
      .subscribe((contract: SmartContract) => {
        this.activeContractCode = contract.code;
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
  }

  private highlightCurrentDebuggingCode(newStep: SmartContractTrace): void {
    const start = newStep.start;
    const stop = newStep.stop;
    const range = new Range(start.line, start.column, stop.line, stop.column);
    const options = { inlineClassName: 'debugging-highlight', hoverMessage: [{ value: 'Current line' }] };
    const newDecorations = [{ range, options }];
    this.monacoDeltaDecorations = this.editor.deltaDecorations(this.monacoDeltaDecorations, newDecorations);
    this.editor.revealLineInCenter(start.line);
  }

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
