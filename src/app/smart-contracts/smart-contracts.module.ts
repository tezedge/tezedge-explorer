import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartContractsRoutingModule } from '@app/smart-contracts/smart-contracts.routing';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { SmartContractsComponent } from './smart-contracts/smart-contracts.component';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { SmartContractsTableComponent } from './smart-contracts-table/smart-contracts-table.component';
import { SmartContractsInputsComponent } from './smart-contracts-inputs/smart-contracts-inputs.component';
import { SmartContractsResultComponent } from './smart-contracts-result/smart-contracts-result.component';
import { SmartContractsCodeComponent } from './smart-contracts-code/smart-contracts-code.component';
import { SmartContractsFiltersComponent } from './smart-contracts-filters/smart-contracts-filters.component';
import { NgxObjectDiffModule } from 'ngx-object-diff';
import { SmartContractsDebugComponent } from './smart-contracts-debug/smart-contracts-debug.component';
import { SmartContractsTableTooltipComponent } from './smart-contracts-table-tooltip/smart-contracts-table-tooltip.component';

export const myMonacoLoad = () => {
  (window as any).monaco.languages.register({ id: 'michelson' });

  // Register a tokens provider for the language
  (window as any).monaco.languages.setMonarchTokensProvider('michelson', {
    tokenizer: {
      root: [
        [/\[error.*/, 'custom-error'],
        [/\[notice.*/, 'custom-notice'],
        [/\[info.*/, 'custom-info'],
        [/\[[a-zA-Z 0-9:]+\]/, 'custom-date'],
        [/[A-Z][A-Z]+/, 'primitive'],
        [/[0-9]+/, 'number'],
        [/(%[\w]+)/, 'percentValue'],
        [/"(.*?)"/g, 'string'],
        [/#.*$/, 'comment'],
        [/(code|storage|parameter)/, 'definition'],
        [/[A-Z][a-z]+/, 'constant'],
        [/(?<=\()(.*?)(?= +)/, 'typeitalic'],
        [/[a-z]|[A-Z]+/, 'type'],
        [/[_]+/, 'type'],
        [/({|}|;|:)/, 'white'],
        [/[(\[]/, 'white'],
        [/[)\]]/, 'white'],
        [/[/*|*/]/, 'secondary'],
      ]
    }
  });

  (window as any).monaco.editor.defineTheme('michelson-theme', {
    base: 'hc-black',
    inherit: false,
    rules: [
      { token: 'custom-info', foreground: '#808080' },
      { token: 'custom-error', foreground: '#ff0000', fontStyle: 'bold' },
      { token: 'custom-notice', foreground: '#ffa500' },
      { token: 'custom-date', foreground: '#008800' },
      { token: 'bracket', foreground: '#dcdcdc' },
      { token: 'brackets', foreground: '#dcdcdc' },
      { token: 'number', foreground: '#b5cea8' },
      { token: 'constant', foreground: '#d0d7b0' },
      { token: 'string', foreground: '#ce9178' },
      { token: 'primitive', foreground: '#d0d7b0' },
      { token: 'definition', foreground: '#3dc9b0' },
      { token: 'typeitalic', foreground: '#689d6a', fontStyle: 'bold' },
      { token: 'type', foreground: '#569cd6' },
      { token: 'comment', foreground: '#608b4e' },
      { token: 'white', foreground: '#dcdcdc' },
      { token: 'secondary', foreground: '#37a2b6' },
      { token: 'percentValue', foreground: '#ced7a6' },
      { token: '', background: '#2a2a2e' },
    ],
    colors: {
      'editor.brackets': '#928374',
      'editor.background': '#2a2a2e',
      'editor.selectionBackground': '#394F76',
      // 'editor.selectionHighlight': '#ffffff',
      'editor.lineHighlightBackground': '#4b4b4b',
      // 'editorCursor.foreground': '#cccccc',
      // 'editorWhitespace.foreground': '#777777',
      'editor.foreground': '#ea9467',
      'minimapSlider.hoverBackground': '#e8e8e819',
      'minimapSlider.activeBackground': '#d0d0d04f',
      'scrollbarSlider.background': '#ffffff40',
      "editor.renderLineHighlight": "gutter",
    }
  });

  (window as any).monaco.languages.registerCompletionItemProvider('michelson', {
    provideCompletionItems: () => {
      const suggestions = [
        {
          label: 'simpleText',
          kind: (window as any).monaco.languages.CompletionItemKind.Text
        }, {
          label: 'testing',
          kind: (window as any).monaco.languages.CompletionItemKind.Keyword,
          insertText: {
            value: 'testing(${1:condition})'
          }
        },
        {
          label: 'ifelse',
          kind: (window as any).monaco.languages.CompletionItemKind.Snippet,
          insertText: {
            value: [
              'if (${1:condition}) {',
              '\t$0',
              '} else {',
              '\t',
              '}'
            ].join('\n')
          },
          documentation: 'If-Else Statement'
        }
      ];
      return { suggestions: primitives() };
    }
  });

};

const monacoConfig: NgxMonacoEditorConfig = {
  onMonacoLoad: myMonacoLoad
};


@NgModule({
  declarations: [
    SmartContractsComponent,
    SmartContractsTableComponent,
    SmartContractsInputsComponent,
    SmartContractsResultComponent,
    SmartContractsCodeComponent,
    SmartContractsFiltersComponent,
    SmartContractsDebugComponent,
    SmartContractsTableTooltipComponent
  ],
  imports: [
    CommonModule,
    SmartContractsRoutingModule,
    TezedgeSharedModule,
    MonacoEditorModule.forRoot(monacoConfig),
    FormsModule,
    NgxObjectDiffModule,
  ],
})
export class SmartContractsModule {}


export function primitives(): any[] {
  return [
    {
      label: 'FAILWITH',
      documentation: 'Explicitly abort the current program.   \'a\n\nFAILWITH / a : _  =>  [FAILED]\n_ / [FAILED]  =>  [FAILED]',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: ['FAILWITH / a : _  =>  [FAILED]',
        '_ / [FAILED]  =>  [FAILED]'],
      insertText: 'FAILWITH'
    },
    {
      label: '{}',
      documentation: 'Empty sequence.\n\n{} / SA  =>  SA',
      detail: ' \'A   ->   \'A',
      kind: 'languages.completionItemKind.Function',
      semantics: ['{} / SA  =>  SA'],
      insertText: '{}'
    },
    {
      label: '{ I ; C }',
      documentation: 'Sequence.\n\nI ; C / SA  =>  SC        where   I / SA  =>  SB        and   C / SB  =>  SC',
      detail: ' \'A   ->   \'C       iff   I \n [ \'A -> \'B ]             C \n [ \'B -> \'C ]',
      kind: 'languages.completionItemKind.Function',
      semantics: ['I ; C / SA  =>  SC        where   I / SA  =>  SB        and   C / SB  =>  SC'],
      insertText: '{ I ; C }'
    },
    {
      label: 'IF',
      documentation: 'Conditional branching.\n\nIF bt bf / True : S  =>  bt / S\nIF bt bf / False : S  =>  bf / S',
      detail: ' bool : \'A   ->   \'B       iff   bt \n [ \'A -> \'B ]             bf \n [ \'A -> \'B ]',
      kind: 'languages.completionItemKind.Function',
      semantics: ['IF bt bf / True : S  =>  bt / S',
        'IF bt bf / False : S  =>  bf / S'],
      insertText: 'IF'
    },
    {
      label: 'LOOP',
      documentation: 'A generic loop.\n\nLOOP body / True : S  =>  body ; LOOP body / S\nLOOP body / False : S  =>  S',
      detail: ' bool : \'A   ->   \'A       iff   body \n [ \'A -> bool : \'A ]',
      kind: 'languages.completionItemKind.Function',
      semantics: ['LOOP body / True : S  =>  body ; LOOP body / S',
        'LOOP body / False : S  =>  S'],
      insertText: 'LOOP'
    },
    {
      label: 'LOOP_LEFT',
      documentation: 'A loop with an accumulator.\n\nLOOP_LEFT body / (Left a) : S  =>  body ; LOOP_LEFT body / a : S\nLOOP_LEFT body / (Right b) : S  =>  b : S',
      detail: ' (or \'a \'b) : \'A   ->  \'b : \'A       iff   body \n [ \'a : \'A -> (or \'a \'b) : \'A ]',
      kind: 'languages.completionItemKind.Function',
      semantics: ['LOOP_LEFT body / (Left a) : S  =>  body ; LOOP_LEFT body / a : S',
        'LOOP_LEFT body / (Right b) : S  =>  b : S'],
      insertText: 'LOOP_LEFT'
    },
    {
      label: 'DIP',
      documentation: 'Runs code protecting the top of the stack.\n\nDIP code / x : S  =>  x : S\'        where    code / S  =>  S\'',
      detail: ' \'b : \'A   ->   \'b : \'C       iff   code \n [ \'A -> \'C ]',
      kind: 'languages.completionItemKind.Function',
      semantics: ['DIP code / x : S  =>  x : S\'        where    code / S  =>  S\''],
      insertText: 'DIP'
    },
    {
      label: 'EXEC',
      documentation: 'Execute a function from the stack.\n\nEXEC / a : f : S  =>  r : S        where f / a : []  =>  r : []',
      detail: ' \'a : lambda \'a \'b : \'C   ->   \'b : \'C',
      kind: 'languages.completionItemKind.Function',
      semantics: ['EXEC / a : f : S  =>  r : S        where f / a : []  =>  r : []'],
      insertText: 'EXEC'
    },
    {
      label: 'DROP',
      documentation: 'Drop the top element of the stack.\n\nDROP / _ : S  =>  S',
      detail: ' _ : \'A   ->   \'A',
      kind: 'languages.completionItemKind.Function',
      semantics: ['DROP / _ : S  =>  S'],
      insertText: 'DROP'
    },
    {
      label: 'DUP',
      documentation: 'Duplicate the top of the stack.\n\nDUP / x : S  =>  x : x : S',
      detail: ' \'a : \'A   ->   \'a : \'a : \'A',
      kind: 'languages.completionItemKind.Function',
      semantics: ['DUP / x : S  =>  x : x : S'],
      insertText: 'DUP'
    },
    {
      label: 'SWAP',
      documentation: 'Exchange the top two elements of the stack.\n\nSWAP / x : y : S  =>  y : x : S',
      detail: ' \'a : \'b : \'A   ->   \'b : \'a : \'A',
      kind: 'languages.completionItemKind.Function',
      semantics: ['SWAP / x : y : S  =>  y : x : S'],
      insertText: 'SWAP'
    },
    {
      label: 'PUSH',
      documentation: 'Push a constant value of a given type onto the stack.\n\nPUSH \'a x / S  =>  x : S',
      detail: ' \'A   ->   \'a : \'A       iff   x \n \'a',
      kind: 'languages.completionItemKind.Function',
      semantics: ['PUSH \'a x / S  =>  x : S'],
      insertText: 'PUSH'
    },
    {
      label: 'UNIT',
      documentation: 'Push a unit value onto the stack.\n\nUNIT / S  =>  Unit : S',
      detail: ' \'A   ->   unit : \'A',
      kind: 'languages.completionItemKind.Function',
      semantics: ['UNIT / S  =>  Unit : S'],
      insertText: 'UNIT'
    },
    {
      label: 'LAMBDA',
      documentation: 'Push a lambda with given parameter and return   types onto the stack.\n\nLAMBDA _ _ code / S  =>  code : S',
      detail: ' \'A ->  (lambda \'a \'b) : \'A',
      kind: 'languages.completionItemKind.Function',
      semantics: ['LAMBDA _ _ code / S  =>  code : S'],
      insertText: 'LAMBDA'
    },
    {
      label: 'EQ',
      documentation: 'Checks that the top of the stack EQuals zero.\n\nEQ / 0 : S  =>  True : S\nEQ / v : S  =>  False : S        iff v <> 0',
      detail: ' int : \'S   ->   bool : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['EQ / 0 : S  =>  True : S',
        'EQ / v : S  =>  False : S        iff v <> 0'],
      insertText: 'EQ'
    },
    {
      label: 'NEQ',
      documentation: 'Checks that the top of the stack does Not EQual zero.\n\nNEQ / 0 : S  =>  False : S\nNEQ / v : S  =>  True : S        iff v <> 0',
      detail: ' int : \'S   ->   bool : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['NEQ / 0 : S  =>  False : S',
        'NEQ / v : S  =>  True : S        iff v <> 0'],
      insertText: 'NEQ'
    },
    {
      label: 'LT',
      documentation: 'Checks that the top of the stack is Less Than zero.\n\nLT / v : S  =>  True : S        iff  v < 0\nLT / v : S  =>  False : S        iff v >= 0',
      detail: ' int : \'S   ->   bool : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['LT / v : S  =>  True : S        iff  v < 0',
        'LT / v : S  =>  False : S        iff v >= 0'],
      insertText: 'LT'
    },
    {
      label: 'GT',
      documentation: 'Checks that the top of the stack is Greater Than zero.\n\nGT / v : S  =>  C / True : S        iff  v > 0\nGT / v : S  =>  C / False : S        iff v <= 0',
      detail: ' int : \'S   ->   bool : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['GT / v : S  =>  C / True : S        iff  v > 0',
        'GT / v : S  =>  C / False : S        iff v <= 0'],
      insertText: 'GT'
    },
    {
      label: 'LE',
      documentation: 'Checks that the top of the stack is Less Than of Equal to   zero.\n\nLE / v : S  =>  True : S        iff  v <= 0\nLE / v : S  =>  False : S        iff v > 0',
      detail: ' int : \'S   ->   bool : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['LE / v : S  =>  True : S        iff  v <= 0',
        'LE / v : S  =>  False : S        iff v > 0'],
      insertText: 'LE'
    },
    {
      label: 'GE',
      documentation: 'Checks that the top of the stack is Greater Than of Equal to   zero.\n\nGE / v : S  =>  True : S        iff  v >= 0\nGE / v : S  =>  False : S        iff v < 0',
      detail: ' int : \'S   ->   bool : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['GE / v : S  =>  True : S        iff  v >= 0',
        'GE / v : S  =>  False : S        iff v < 0'],
      insertText: 'GE'
    },
    {
      label: 'OR',
      documentation: 'logical or.\n\nOR / x : y : S  =>  (x | y) : S',
      detail: ' bool : bool : \'S   ->   bool : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['OR / x : y : S  =>  (x | y) : S'],
      insertText: 'OR'
    },
    {
      label: 'AND',
      documentation: '\n\n AND / x : y : S  =>  (x & y) : S',
      detail: ' bool : bool : \'S   ->   bool : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' AND / x : y : S  =>  (x & y) : S'],
      insertText: 'AND'
    },
    {
      label: 'XOR',
      documentation: '\n\n XOR / x : y : S  =>  (x ^ y) : S',
      detail: ' bool : bool : \'S   ->   bool : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' XOR / x : y : S  =>  (x ^ y) : S'],
      insertText: 'XOR'
    },
    {
      label: 'NOT',
      documentation: '\n\n NOT / x : S  =>  ~x : S',
      detail: ' bool : \'S   ->   bool : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' NOT / x : S  =>  ~x : S'],
      insertText: 'NOT'
    },
    {
      label: 'NEG',
      documentation: '\n\n NEG / x : S  =>  -x : S',
      detail: ' int : \'S   ->   int : \'S    \n nat : \'S   ->   int : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' NEG / x : S  =>  -x : S'],
      insertText: 'NEG'
    },
    {
      label: 'ABS',
      documentation: '\n\n ABS / x : S  =>  abs (x) : S',
      detail: ' int : \'S   ->   nat : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' ABS / x : S  =>  abs (x) : S'],
      insertText: 'ABS'
    },
    {
      label: 'ADD',
      documentation: '\n\n ADD / x : y : S  =>  (x + y) : S',
      detail: ' int : int : \'S   ->   int : \'S    \n int : nat : \'S   ->   int : \'S    \n nat : int : \'S   ->   int : \'S    \n nat : nat : \'S   ->   nat : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' ADD / x : y : S  =>  (x + y) : S'],
      insertText: 'ADD'
    },
    {
      label: 'SUB',
      documentation: '\n\n SUB / x : y : S  =>  (x - y) : S',
      detail: ' int : int : \'S   ->   int : \'S    \n int : nat : \'S   ->   int : \'S    \n nat : int : \'S   ->   int : \'S    \n nat : nat : \'S   ->   int : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' SUB / x : y : S  =>  (x - y) : S'],
      insertText: 'SUB'
    },
    {
      label: 'MUL',
      documentation: '\n\n MUL / x : y : S  =>  (x * y) : S',
      detail: ' int : int : \'S   ->   int : \'S    \n int : nat : \'S   ->   int : \'S    \n nat : int : \'S   ->   int : \'S    \n nat : nat : \'S   ->   nat : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' MUL / x : y : S  =>  (x * y) : S'],
      insertText: 'MUL'
    },
    {
      label: 'EDIV P',
      documentation: '\n\n EDIV / x : 0 : S  =>  None : S\n EDIV / x : y : S  =>  Some (Pair (x / y) (x % y)) : S        iff y <> 0',
      detail: ' int : int : \'S   ->   option (pair int nat) : \'S    \n int : nat : \'S   ->   option (pair int nat) : \'S    \n nat : int : \'S   ->   option (pair int nat) : \'S    \n nat : nat : \'S   ->   option (pair nat nat) : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' EDIV / x : 0 : S  =>  None : S',
        ' EDIV / x : y : S  =>  Some (Pair (x / y) (x % y)) : S        iff y <> 0'],
      insertText: 'EDIV P'
    },
    {
      label: 'OR',
      documentation: '\n\n OR / x : y : S  =>  (x | y) : S',
      detail: ' nat : nat : \'S   ->   nat : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' OR / x : y : S  =>  (x | y) : S'],
      insertText: 'OR'
    },
    {
      label: 'AND (',
      documentation: '\n\n AND / x : y : S  =>  (x & y) : S',
      detail: ' nat : nat : \'S   ->   nat : \'S    \n int : nat : \'S   ->   nat : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' AND / x : y : S  =>  (x & y) : S'],
      insertText: 'AND ('
    },
    {
      label: 'XOR',
      documentation: '\n\n XOR / x : y : S  =>  (x ^ y) : S',
      detail: ' nat : nat : \'S   ->   nat : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' XOR / x : y : S  =>  (x ^ y) : S'],
      insertText: 'XOR'
    },
    {
      label: 'NOT T',
      documentation: '\n\n NOT / x : S  =>  ~x : S',
      detail: ' nat : \'S   ->   int : \'S    \n int : \'S   ->   int : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' NOT / x : S  =>  ~x : S'],
      insertText: 'NOT T'
    },
    {
      label: 'LSL',
      documentation: '\n\n LSL / x : s : S  =>  (x << s) : S        iff   s <= 256\n LSL / x : s : S  =>  [FAILED]        iff   s > 256',
      detail: ' nat : nat : \'S   ->   nat : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' LSL / x : s : S  =>  (x << s) : S        iff   s <= 256',
        ' LSL / x : s : S  =>  [FAILED]        iff   s > 256'],
      insertText: 'LSL'
    },
    {
      label: 'LSR',
      documentation: '\n\n LSR / x : s : S  =>  (x >> s) : S        iff   s <= 256\n LSR / x : s : S  =>  [FAILED]        iff   s > 256',
      detail: ' nat : nat : \'S   ->   nat : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' LSR / x : s : S  =>  (x >> s) : S        iff   s <= 256',
        ' LSR / x : s : S  =>  [FAILED]        iff   s > 256'],
      insertText: 'LSR'
    },
    {
      label: 'COMPARE',
      documentation: 'Integer/natural comparison\n\nCOMPARE / x : y : S  =>  -1 : S        iff x < y\nCOMPARE / x : y : S  =>  0 : S        iff x = y\nCOMPARE / x : y : S  =>  1 : S        iff x > y',
      detail: ' int : int : \'S   ->   int : \'S    \n nat : nat : \'S   ->   int : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['COMPARE / x : y : S  =>  -1 : S        iff x < y',
        'COMPARE / x : y : S  =>  0 : S        iff x = y',
        'COMPARE / x : y : S  =>  1 : S        iff x > y'],
      insertText: 'COMPARE'
    },
    {
      label: 'CONCAT',
      documentation: 'String concatenation.\n\nCONCAT / s : t : S  =>  (s ^ t) : S    :: string list : \'S   -> string : \'S\nCONCAT / {} : S  =>  "" : S\nCONCAT / { s ; <ss> } : S  =>  (s ^ r) : S       where CONCAT / { <ss> } : S  =>  r : S',
      detail: ' string : string : \'S   -> string : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['CONCAT / s : t : S  =>  (s ^ t) : S    :: string list : \'S   -> string : \'S',
        'CONCAT / {} : S  =>  "" : S',
        'CONCAT / { s ; <ss> } : S  =>  (s ^ r) : S       where CONCAT / { <ss> } : S  =>  r : S'],
      insertText: 'CONCAT'
    },
    {
      label: 'SIZE',
      documentation: 'number of characters in a string.\n\n',
      detail: ' string : \'S   ->   nat : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'SIZE'
    },
    {
      label: 'SLICE',
      documentation: 'String access.\n\nSLICE / offset : length : s : S  =>  Some ss : S       where ss is the substring of s at the given offset and of the given length         iff offset and (offset + length) are in bounds\nSLICE / offset : length : s : S  =>  None  : S         iff offset or (offset + length) are out of bounds',
      detail: ' nat : nat : string : \'S   ->  option string : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['SLICE / offset : length : s : S  =>  Some ss : S       where ss is the substring of s at the given offset and of the given length         iff offset and (offset + length) are in bounds',
        'SLICE / offset : length : s : S  =>  None  : S         iff offset or (offset + length) are out of bounds'],
      insertText: 'SLICE'
    },
    {
      label: 'COMPARE',
      documentation: 'Lexicographic comparison.\n\nCOMPARE / s : t : S  =>  -1 : S        iff s < t\nCOMPARE / s : t : S  =>  0 : S        iff s = t\nCOMPARE / s : t : S  =>  1 : S        iff s > t',
      detail: ' string : string : \'S   ->   int : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['COMPARE / s : t : S  =>  -1 : S        iff s < t',
        'COMPARE / s : t : S  =>  0 : S        iff s = t',
        'COMPARE / s : t : S  =>  1 : S        iff s > t'],
      insertText: 'COMPARE'
    },
    {
      label: 'PAIR',
      documentation: 'Build a pair from the stack\'s top two elements.\n\nPAIR / a : b : S  =>  (Pair a b) : S',
      detail: ' \'a : \'b : \'S   ->   pair \'a \'b : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['PAIR / a : b : S  =>  (Pair a b) : S'],
      insertText: 'PAIR'
    },
    {
      label: 'CAR',
      documentation: 'Access the left part of a pair.\n\nCAR / (Pair a _) : S  =>  a : S',
      detail: ' pair \'a _ : \'S   ->   \'a : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['CAR / (Pair a _) : S  =>  a : S'],
      insertText: 'CAR'
    },
    {
      label: 'CDR',
      documentation: 'Access the right part of a pair.\n\nCDR / (Pair _ b) : S  =>  b : S',
      detail: ' pair _ \'b : \'S   ->   \'b : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['CDR / (Pair _ b) : S  =>  b : S'],
      insertText: 'CDR'
    },
    {
      label: 'EMPTY_SET',
      documentation: 'Build a new, empty set for elements of a given   type.   The ``\'elt`` type must be comparable (the ``COMPARE``   primitive must be defined over it).\n\nEMPTY_SET _ / S  =>  {} : S',
      detail: ' \'S   ->   set \'elt : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['EMPTY_SET _ / S  =>  {} : S'],
      insertText: 'EMPTY_SET'
    },
    {
      label: 'MEM',
      documentation: 'Check for the presence of an element in a set.\n\nMEM / x : {} : S  =>  false : S\nMEM / x : { hd ; <tl> } : S  =>  r : S        iff COMPARE / x : hd : []  =>  1 : []        where MEM / x : { <tl> } : S  =>  r : S\nMEM / x : { hd ; <tl> } : S  =>  true : S        iff COMPARE / x : hd : []  =>  0 : []\nMEM / x : { hd ; <tl> } : S  =>  false : S        iff COMPARE / x : hd : []  =>  -1 : []',
      detail: ' \'elt : set \'elt : \'S   ->  bool : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['MEM / x : {} : S  =>  false : S',
        'MEM / x : { hd ; <tl> } : S  =>  r : S        iff COMPARE / x : hd : []  =>  1 : []        where MEM / x : { <tl> } : S  =>  r : S',
        'MEM / x : { hd ; <tl> } : S  =>  true : S        iff COMPARE / x : hd : []  =>  0 : []',
        'MEM / x : { hd ; <tl> } : S  =>  false : S        iff COMPARE / x : hd : []  =>  -1 : []'],
      insertText: 'MEM'
    },
    {
      label: 'UPDATE',
      documentation: 'Inserts or removes an element in a set, replacing a   previous value.\n\nUPDATE / x : false : {} : S  =>  {} : S\nUPDATE / x : true : {} : S  =>  { x } : S\nUPDATE / x : v : { hd ; <tl> } : S  =>  { hd ; <tl\'> } : S        iff COMPARE / x : hd : []  =>  1 : []        where UPDATE / x : v : { <tl> } : S  =>  { <tl\'> } : S\nUPDATE / x : false : { hd ; <tl> } : S  =>  { <tl> } : S        iff COMPARE / x : hd : []  =>  0 : []\nUPDATE / x : true : { hd ; <tl> } : S  =>  { hd ; <tl> } : S        iff COMPARE / x : hd : []  =>  0 : []\nUPDATE / x : false : { hd ; <tl> } : S  =>  { hd ; <tl> } : S        iff COMPARE / x : hd : []  =>  -1 : []\nUPDATE / x : true : { hd ; <tl> } : S  =>  { x ; hd ; <tl> } : S        iff COMPARE / x : hd : []  =>  -1 : []',
      detail: ' \'elt : bool : set \'elt : \'S   ->   set \'elt : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['UPDATE / x : false : {} : S  =>  {} : S',
        'UPDATE / x : true : {} : S  =>  { x } : S',
        'UPDATE / x : v : { hd ; <tl> } : S  =>  { hd ; <tl\'> } : S        iff COMPARE / x : hd : []  =>  1 : []        where UPDATE / x : v : { <tl> } : S  =>  { <tl\'> } : S',
        'UPDATE / x : false : { hd ; <tl> } : S  =>  { <tl> } : S        iff COMPARE / x : hd : []  =>  0 : []',
        'UPDATE / x : true : { hd ; <tl> } : S  =>  { hd ; <tl> } : S        iff COMPARE / x : hd : []  =>  0 : []',
        'UPDATE / x : false : { hd ; <tl> } : S  =>  { hd ; <tl> } : S        iff COMPARE / x : hd : []  =>  -1 : []',
        'UPDATE / x : true : { hd ; <tl> } : S  =>  { x ; hd ; <tl> } : S        iff COMPARE / x : hd : []  =>  -1 : []'],
      insertText: 'UPDATE'
    },
    {
      label: 'ITER',
      documentation: 'Apply the body expression to each element of a set.   The body sequence has access to the stack.\n\nITER body / {} : S  =>  S\nITER body / { hd ; <tl> } : S  =>  body; ITER body / hd : { <tl> } : S',
      detail: ' (set \'elt) : \'A   ->  \'A       iff body \n [ \'elt : \'A -> \'A ]',
      kind: 'languages.completionItemKind.Function',
      semantics: ['ITER body / {} : S  =>  S',
        'ITER body / { hd ; <tl> } : S  =>  body; ITER body / hd : { <tl> } : S'],
      insertText: 'ITER'
    },
    {
      label: 'SIZE',
      documentation: 'Get the cardinality of the set.\n\nSIZE / {} : S  =>  0 : S\nSIZE / { _ ; <tl> } : S  =>  1 + s : S        where SIZE / { <tl> } : S  =>  s : S',
      detail: ' set \'elt : \'S -> nat : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['SIZE / {} : S  =>  0 : S',
        'SIZE / { _ ; <tl> } : S  =>  1 + s : S        where SIZE / { <tl> } : S  =>  s : S'],
      insertText: 'SIZE'
    },
    {
      label: 'EMPTY_MAP',
      documentation: 'Build a new, empty map from keys of a   given type to values of another given type.   The ``\'key`` type must be comparable (the ``COMPARE`` primitive must   be defined over it).\n\nEMPTY_MAP _ _ / S  =>  {} : S',
      detail: ' \'S -> map \'key \'val : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['EMPTY_MAP _ _ / S  =>  {} : S'],
      insertText: 'EMPTY_MAP'
    },
    {
      label: 'GET',
      documentation: 'Access an element in a map, returns an optional value to be   checked with ``IF_SOME``.\n\nGET / x : {} : S  =>  None : S\nGET / x : { Elt k v ; <tl> } : S  =>  opt_y : S        iff COMPARE / x : k : []  =>  1 : []        where GET / x : { <tl> } : S  =>  opt_y : S\nGET / x : { Elt k v ; <tl> } : S  =>  Some v : S        iff COMPARE / x : k : []  =>  0 : []\nGET / x : { Elt k v ; <tl> } : S  =>  None : S        iff COMPARE / x : k : []  =>  -1 : []',
      detail: ' \'key : map \'key \'val : \'S   ->   option \'val : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['GET / x : {} : S  =>  None : S',
        'GET / x : { Elt k v ; <tl> } : S  =>  opt_y : S        iff COMPARE / x : k : []  =>  1 : []        where GET / x : { <tl> } : S  =>  opt_y : S',
        'GET / x : { Elt k v ; <tl> } : S  =>  Some v : S        iff COMPARE / x : k : []  =>  0 : []',
        'GET / x : { Elt k v ; <tl> } : S  =>  None : S        iff COMPARE / x : k : []  =>  -1 : []'],
      insertText: 'GET'
    },
    {
      label: 'MEM',
      documentation: 'Check for the presence of a binding for a key in a map.\n\nMEM / x : {} : S  =>  false : S\nMEM / x : { Elt k v ; <tl> } : S  =>  r : S        iff COMPARE / x : k : []  =>  1 : []        where MEM / x : { <tl> } : S  =>  r : S\nMEM / x : { Elt k v ; <tl> } : S  =>  true : S        iff COMPARE / x : k : []  =>  0 : []\nMEM / x : { Elt k v ; <tl> } : S  =>  false : S        iff COMPARE / x : k : []  =>  -1 : []',
      detail: ' \'key : map \'key \'val : \'S   ->  bool : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['MEM / x : {} : S  =>  false : S',
        'MEM / x : { Elt k v ; <tl> } : S  =>  r : S        iff COMPARE / x : k : []  =>  1 : []        where MEM / x : { <tl> } : S  =>  r : S',
        'MEM / x : { Elt k v ; <tl> } : S  =>  true : S        iff COMPARE / x : k : []  =>  0 : []',
        'MEM / x : { Elt k v ; <tl> } : S  =>  false : S        iff COMPARE / x : k : []  =>  -1 : []'],
      insertText: 'MEM'
    },
    {
      label: 'UPDATE',
      documentation: 'Assign or remove an element in a map.\n\nUPDATE / x : None : {} : S  =>  {} : S\nUPDATE / x : Some y : {} : S  =>  { Elt x y } : S\nUPDATE / x : opt_y : { Elt k v ; <tl> } : S  =>  { Elt k v ; <tl\'> } : S        iff COMPARE / x : k : []  =>  1 : []          where UPDATE / x : opt_y : { <tl> } : S  =>  { <tl\'> } : S\nUPDATE / x : None : { Elt k v ; <tl> } : S  =>  { <tl> } : S        iff COMPARE / x : k : []  =>  0 : []\nUPDATE / x : Some y : { Elt k v ; <tl> } : S  =>  { Elt k y ; <tl> } : S        iff COMPARE / x : k : []  =>  0 : []\nUPDATE / x : None : { Elt k v ; <tl> } : S  =>  { Elt k v ; <tl> } : S        iff COMPARE / x : k : []  =>  -1 : []\nUPDATE / x : Some y : { Elt k v ; <tl> } : S  =>  { Elt x y ; Elt k v ; <tl> } : S        iff COMPARE / x : k : []  =>  -1 : []',
      detail: ' \'key : option \'val : map \'key \'val : \'S   ->   map \'key \'val : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['UPDATE / x : None : {} : S  =>  {} : S',
        'UPDATE / x : Some y : {} : S  =>  { Elt x y } : S',
        'UPDATE / x : opt_y : { Elt k v ; <tl> } : S  =>  { Elt k v ; <tl\'> } : S        iff COMPARE / x : k : []  =>  1 : []          where UPDATE / x : opt_y : { <tl> } : S  =>  { <tl\'> } : S',
        'UPDATE / x : None : { Elt k v ; <tl> } : S  =>  { <tl> } : S        iff COMPARE / x : k : []  =>  0 : []',
        'UPDATE / x : Some y : { Elt k v ; <tl> } : S  =>  { Elt k y ; <tl> } : S        iff COMPARE / x : k : []  =>  0 : []',
        'UPDATE / x : None : { Elt k v ; <tl> } : S  =>  { Elt k v ; <tl> } : S        iff COMPARE / x : k : []  =>  -1 : []',
        'UPDATE / x : Some y : { Elt k v ; <tl> } : S  =>  { Elt x y ; Elt k v ; <tl> } : S        iff COMPARE / x : k : []  =>  -1 : []'],
      insertText: 'UPDATE'
    },
    {
      label: 'MAP',
      documentation: 'Apply the body expression to each element of a map. The   body sequence has access to the stack.\n\nMAP body / {} : S  =>  {} : S\nMAP body / { Elt k v ; <tl> } : S  =>  { Elt k (body (Pair k v)) ; <tl\'> } : S        where MAP body / { <tl> } : S  =>  { <tl\'> } : S',
      detail: ' (map \'key \'val) : \'A   ->  (map \'key \'b) : \'A       iff   body \n [ (pair \'key \'val) : \'A -> \'b : \'A ]',
      kind: 'languages.completionItemKind.Function',
      semantics: ['MAP body / {} : S  =>  {} : S',
        'MAP body / { Elt k v ; <tl> } : S  =>  { Elt k (body (Pair k v)) ; <tl\'> } : S        where MAP body / { <tl> } : S  =>  { <tl\'> } : S'],
      insertText: 'MAP'
    },
    {
      label: 'ITER',
      documentation: 'Apply the body expression to each element of a map.   The body sequence has access to the stack.\n\nITER body / {} : S  =>  S\nITER body / { Elt k v ; <tl> } : S  =>  body ; ITER body / (Pair k v) : { <tl> } : S',
      detail: ' (map \'elt \'val) : \'A   ->  \'A       iff   body \n [ (pair \'elt \'val : \'A) -> \'A ]',
      kind: 'languages.completionItemKind.Function',
      semantics: ['ITER body / {} : S  =>  S',
        'ITER body / { Elt k v ; <tl> } : S  =>  body ; ITER body / (Pair k v) : { <tl> } : S'],
      insertText: 'ITER'
    },
    {
      label: 'SIZE',
      documentation: 'Get the cardinality of the map.\n\nSIZE / {} : S  =>  0 : S\nSIZE / { _ ; <tl> } : S  =>  1 + s : S        where  SIZE / { <tl> } : S  =>  s : S',
      detail: ' map \'key \'val : \'S -> nat : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['SIZE / {} : S  =>  0 : S',
        'SIZE / { _ ; <tl> } : S  =>  1 + s : S        where  SIZE / { <tl> } : S  =>  s : S'],
      insertText: 'SIZE'
    },
    {
      label: 'GET',
      documentation: 'Access an element in a ``big_map``, returns an optional value to be   checked with ``IF_SOME``.\n\n',
      detail: ' \'key : big_map \'key \'val : \'S   ->   option \'val : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'GET'
    },
    {
      label: 'MEM',
      documentation: 'Check for the presence of an element in a ``big_map``.\n\n',
      detail: ' \'key : big_map \'key \'val : \'S   ->  bool : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'MEM'
    },
    {
      label: 'UPDATE',
      documentation: 'Assign or remove an element in a ``big_map``.\n\n',
      detail: ' \'key : option \'val : big_map \'key \'val : \'S   ->   big_map \'key \'val : \'SOperations on optional values~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'UPDATE'
    },
    {
      label: 'SOME',
      documentation: 'Pack a present optional value.\n\nSOME / v : S  =>  (Some v) : S',
      detail: ' \'a : \'S   ->   option \'a : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['SOME / v : S  =>  (Some v) : S'],
      insertText: 'SOME'
    },
    {
      label: 'NONE',
      documentation: 'The absent optional value.\n\nNONE / v : S  =>  None : S',
      detail: ' \'S   ->   option \'a : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['NONE / v : S  =>  None : S'],
      insertText: 'NONE'
    },
    {
      label: 'IF_NONE',
      documentation: 'Inspect an optional value.\n\nIF_NONE bt bf / (None) : S  =>  bt / S\nIF_NONE bt bf / (Some a) : S  =>  bf / a : S',
      detail: ' option \'a : \'S   ->   \'b : \'S       iff   bt \n [ \'S -> \'b : \'S]             bf \n [ \'a : \'S -> \'b : \'S]',
      kind: 'languages.completionItemKind.Function',
      semantics: ['IF_NONE bt bf / (None) : S  =>  bt / S',
        'IF_NONE bt bf / (Some a) : S  =>  bf / a : S'],
      insertText: 'IF_NONE'
    },
    {
      label: 'LEFT',
      documentation: 'Pack a value in a union (left case).\n\nLEFT / v : S  =>  (Left v) : S',
      detail: ' \'a : \'S   ->   or \'a \'b : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['LEFT / v : S  =>  (Left v) : S'],
      insertText: 'LEFT'
    },
    {
      label: 'RIGHT',
      documentation: 'Pack a value in a union (right case).\n\nRIGHT / v : S  =>  (Right v) : S',
      detail: ' \'b : \'S   ->   or \'a \'b : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['RIGHT / v : S  =>  (Right v) : S'],
      insertText: 'RIGHT'
    },
    {
      label: 'IF_LEFT',
      documentation: 'Inspect a value of a union.\n\nIF_LEFT bt bf / (Left a) : S  =>  bt / a : S\nIF_LEFT bt bf / (Right b) : S  =>  bf / b : S',
      detail: ' or \'a \'b : \'S   ->   \'c : \'S       iff   bt \n [ \'a : \'S -> \'c : \'S]             bf \n [ \'b : \'S -> \'c : \'S]',
      kind: 'languages.completionItemKind.Function',
      semantics: ['IF_LEFT bt bf / (Left a) : S  =>  bt / a : S',
        'IF_LEFT bt bf / (Right b) : S  =>  bf / b : S'],
      insertText: 'IF_LEFT'
    },
    {
      label: 'IF_RIGHT',
      documentation: 'Inspect a value of a union.\n\nIF_RIGHT bt bf / (Right b) : S  =>  bt / b : S\nIF_RIGHT bt bf / (Left a) : S  =>  bf / a : S',
      detail: ' or \'a \'b : \'S   ->   \'c : \'S       iff   bt \n [ \'b : \'S -> \'c : \'S]             bf \n [ \'a : \'S -> \'c : \'S]',
      kind: 'languages.completionItemKind.Function',
      semantics: ['IF_RIGHT bt bf / (Right b) : S  =>  bt / b : S',
        'IF_RIGHT bt bf / (Left a) : S  =>  bf / a : S'],
      insertText: 'IF_RIGHT'
    },
    {
      label: 'CONS',
      documentation: 'Prepend an element to a list.\n\nCONS / a : { <l> } : S  =>  { a ; <l> } : S',
      detail: ' \'a : list \'a : \'S   ->   list \'a : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['CONS / a : { <l> } : S  =>  { a ; <l> } : S'],
      insertText: 'CONS'
    },
    {
      label: 'NIL',
      documentation: 'The empty list.\n\nNIL / S  =>  {} : S',
      detail: ' \'S   ->   list \'a : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['NIL / S  =>  {} : S'],
      insertText: 'NIL'
    },
    {
      label: 'IF_CONS',
      documentation: 'Inspect a list.\n\nIF_CONS bt bf / { a ; <rest> } : S  =>  bt / a : { <rest> } : S\nIF_CONS bt bf / {} : S  =>  bf / S',
      detail: ' list \'a : \'S   ->   \'b : \'S       iff   bt \n [ \'a : list \'a : \'S -> \'b : \'S]             bf \n [ \'S -> \'b : \'S]',
      kind: 'languages.completionItemKind.Function',
      semantics: ['IF_CONS bt bf / { a ; <rest> } : S  =>  bt / a : { <rest> } : S',
        'IF_CONS bt bf / {} : S  =>  bf / S'],
      insertText: 'IF_CONS'
    },
    {
      label: 'MAP',
      documentation: 'Apply the body expression to each element of the list.   The body sequence has access to the stack.\n\nMAP body / { a ; <rest> } : S  =>  { body a ; <rest\'> } : S        where MAP body / { <rest> } : S  =>  { <rest\'> } : S\nMAP body / {} : S  =>  {} : S',
      detail: ' (list \'elt) : \'A   ->  (list \'b) : \'A       iff   body \n [ \'elt : \'A -> \'b : \'A ]',
      kind: 'languages.completionItemKind.Function',
      semantics: ['MAP body / { a ; <rest> } : S  =>  { body a ; <rest\'> } : S        where MAP body / { <rest> } : S  =>  { <rest\'> } : S',
        'MAP body / {} : S  =>  {} : S'],
      insertText: 'MAP'
    },
    {
      label: 'SIZE',
      documentation: 'Get the number of elements in the list.\n\nSIZE / { _ ; <rest> } : S  =>  1 + s : S        where  SIZE / { <rest> } : S  =>  s : S\nSIZE / {} : S  =>  0 : S',
      detail: ' list \'elt : \'S -> nat : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['SIZE / { _ ; <rest> } : S  =>  1 + s : S        where  SIZE / { <rest> } : S  =>  s : S',
        'SIZE / {} : S  =>  0 : S'],
      insertText: 'SIZE'
    },
    {
      label: 'ITER',
      documentation: 'Apply the body expression to each element of a list.   The body sequence has access to the stack.\n\nITER body / { a ; <rest> } : S  =>  body ; ITER body / a : { <rest> } : S\nITER body / {} : S  =>  S',
      detail: ' (list \'elt) : \'A   ->  \'A         iff body \n [ \'elt : \'A -> \'A ]',
      kind: 'languages.completionItemKind.Function',
      semantics: ['ITER body / { a ; <rest> } : S  =>  body ; ITER body / a : { <rest> } : S',
        'ITER body / {} : S  =>  S'],
      insertText: 'ITER'
    },
    {
      label: 'ADD',
      documentation: 'Increment / decrement a timestamp of the given number of   seconds.\n\nADD / seconds : nat (t) : S  =>  (seconds + t) : S\nADD / nat (t) : seconds : S  =>  (t + seconds) : S',
      detail: ' timestamp : int : \'S -> timestamp : \'S    \n int : timestamp : \'S -> timestamp : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['ADD / seconds : nat (t) : S  =>  (seconds + t) : S',
        'ADD / nat (t) : seconds : S  =>  (t + seconds) : S'],
      insertText: 'ADD'
    },
    {
      label: 'SUB',
      documentation: 'Subtract a number of seconds from a timestamp.\n\nSUB / seconds : nat (t) : S  =>  (seconds - t) : S',
      detail: ' timestamp : int : \'S -> timestamp : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['SUB / seconds : nat (t) : S  =>  (seconds - t) : S'],
      insertText: 'SUB'
    },
    {
      label: 'SUB',
      documentation: 'Subtract two timestamps.\n\nSUB / seconds(t1) : seconds(t2) : S  =>  (t1 - t2) : S',
      detail: ' timestamp : timestamp : \'S -> int : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['SUB / seconds(t1) : seconds(t2) : S  =>  (t1 - t2) : S'],
      insertText: 'SUB'
    },
    {
      label: 'COMPARE',
      documentation: 'Timestamp comparison.\n\nCOMPARE / seconds(t1) : seconds(t2) : S  =>  -1 : S        iff t1 < t2\nCOMPARE / seconds(t1) : seconds(t2) : S  =>  0 : S        iff t1 = t2\nCOMPARE / seconds(t1) : seconds(t2) : S  =>  1 : S        iff t1 > t2',
      detail: ' timestamp : timestamp : \'S   ->   int : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['COMPARE / seconds(t1) : seconds(t2) : S  =>  -1 : S        iff t1 < t2',
        'COMPARE / seconds(t1) : seconds(t2) : S  =>  0 : S        iff t1 = t2',
        'COMPARE / seconds(t1) : seconds(t2) : S  =>  1 : S        iff t1 > t2'],
      insertText: 'COMPARE'
    },
    {
      label: 'ADD',
      documentation: '\n\n ADD / x : y : S  =>  [FAILED]   on overflow\n ADD / x : y : S  =>  (x + y) : S',
      detail: ' mutez : mutez : \'S   ->   mutez : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' ADD / x : y : S  =>  [FAILED]   on overflow',
        ' ADD / x : y : S  =>  (x + y) : S'],
      insertText: 'ADD'
    },
    {
      label: 'SUB',
      documentation: '\n\n SUB / x : y : S  =>  [FAILED]        iff   x < y\n SUB / x : y : S  =>  (x - y) : S',
      detail: ' mutez : mutez : \'S   ->   mutez : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' SUB / x : y : S  =>  [FAILED]        iff   x < y',
        ' SUB / x : y : S  =>  (x - y) : S'],
      insertText: 'SUB'
    },
    {
      label: 'MUL',
      documentation: '\n\n MUL / x : y : S  =>  [FAILED]   on overflow\n MUL / x : y : S  =>  (x * y) : S',
      detail: ' mutez : nat : \'S   ->   mutez : \'S    \n nat : mutez : \'S   ->   mutez : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' MUL / x : y : S  =>  [FAILED]   on overflow',
        ' MUL / x : y : S  =>  (x * y) : S'],
      insertText: 'MUL'
    },
    {
      label: 'EDIV',
      documentation: '\n\n EDIV / x : 0 : S  =>  None\n EDIV / x : y : S  =>  Some (Pair (x / y) (x % y)) : S        iff y <> 0',
      detail: ' mutez : nat : \'S   ->   option (pair mutez mutez) : \'S    \n mutez : mutez : \'S   ->   option (pair nat mutez) : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' EDIV / x : 0 : S  =>  None',
        ' EDIV / x : y : S  =>  Some (Pair (x / y) (x % y)) : S        iff y <> 0'],
      insertText: 'EDIV'
    },
    {
      label: 'COMPARE',
      documentation: '\n\n COMPARE / x : y : S  =>  -1 : S       iff x < y\n COMPARE / x : y : S  =>  0 : S       iff x = y\n COMPARE / x : y : S  =>  1 : S       iff x > y',
      detail: ' mutez : mutez : \'S -> int : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [' COMPARE / x : y : S  =>  -1 : S       iff x < y',
        ' COMPARE / x : y : S  =>  0 : S       iff x = y',
        ' COMPARE / x : y : S  =>  1 : S       iff x > y'],
      insertText: 'COMPARE'
    },
    {
      label: 'CREATE_CONTRACT',
      documentation: 'Forge a new contract from a literal.\n\n',
      detail: ' key_hash : option key_hash : bool : bool : mutez : \'g : \'S       -> operation : address : \'SOriginate a contract based on a literal. This is currently the only wayto include transfers inside of an originated contract. The firstparameters are the manager, optional delegate, then spendable anddelegatable flags and finally the initial amount taken from thecurrently executed contract. The contract is returned as a first classvalue (to be dropped, passed as parameter or stored).The ``CONTRACT \'p`` instruction will fail until it is actually originated.',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'CREATE_CONTRACT {'
    },
    {
      label: 'CREATE_ACCOUNT',
      documentation: 'Forge an account (a contract without code) creation operation.\n\n',
      detail: ' key_hash : option key_hash : bool : mutez : \'S       ->   operation : address : \'STake as argument the manager, optional delegate, the delegatable flagand finally the initial amount taken from the currently executedcontract.',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'CREATE_ACCOUNT'
    },
    {
      label: 'TRANSFER_TOKENS',
      documentation: 'Forge a transaction.\n\n',
      detail: ' \'p : mutez : contract \'p : \'S   ->   operation : SThe parameter must be consistent with the one expected by thecontract, unit for an account.',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'TRANSFER_TOKENS'
    },
    {
      label: 'SET_DELEGATE',
      documentation: 'Forge a delegation.\n\n',
      detail: ' option key_hash : \'S   ->   operation : S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'SET_DELEGATE'
    },
    {
      label: 'BALANCE',
      documentation: 'Push the current amount of mutez of the current contract.\n\n',
      detail: ' \'S   ->   mutez : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'BALANCE'
    },
    {
      label: 'ADDRESS',
      documentation: 'Push the address of a contract.\n\n',
      detail: ' contract _ : \'S   ->   address : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'ADDRESS'
    },
    {
      label: 'CONTRACT',
      documentation: 'Push the untyped version of a contract.\n\nCONTRACT / addr : S  =>  Some addr : S        iff addr exists and is a contract of parameter type \'p\nCONTRACT / addr : S  =>  Some addr : S        iff \'p = unit and addr is an implicit contract\nCONTRACT / addr : S  =>  None : S        otherwise',
      detail: ' address : \'S   ->   option (contract \'p) : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['CONTRACT / addr : S  =>  Some addr : S        iff addr exists and is a contract of parameter type \'p',
        'CONTRACT / addr : S  =>  Some addr : S        iff \'p = unit and addr is an implicit contract',
        'CONTRACT / addr : S  =>  None : S        otherwise'],
      insertText: 'CONTRACT'
    },
    {
      label: 'SOURCE',
      documentation: 'Push the contract that initiated the current   transaction, i.e. the contract that paid the fees and   storage cost, and whose manager signed the operation   that was sent on the blockchain. Note that since   ``TRANSFER_TOKENS`` instructions can be chained,   ``SOURCE`` and ``SENDER`` are not necessarily the same.\n\n',
      detail: ' \'S   ->   address : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'SOURCE'
    },
    {
      label: 'SENDER',
      documentation: 'Push the contract that initiated the current   internal transaction. It may be the ``SOURCE``, but may   also not if the source sent an order to an intermediate   smart contract, which then called the current contract.\n\n',
      detail: ' \'S   ->   address : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'SENDER'
    },
    {
      label: 'SELF',
      documentation: 'Push the current contract.\n\n',
      detail: ' \'S   ->   contract \'p : \'S       where   contract \'p is the type of the current contract',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'SELF'
    },
    {
      label: 'AMOUNT',
      documentation: 'Push the amount of the current transaction.\n\n',
      detail: ' \'S   ->   mutez : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'AMOUNT'
    },
    {
      label: 'IMPLICIT_ACCOUNT',
      documentation: 'Return a default contract with the given   public/private key pair. Any funds deposited in this contract can   immediately be spent by the holder of the private key. This contract   cannot execute Michelson code and will always exist on the   blockchain.\n\n',
      detail: ' key_hash : \'S   ->   contract unit : \'SSpecial operations~~~~~~~~~~~~~~~~~~',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'IMPLICIT_ACCOUNT'
    },
    {
      label: 'STEPS_TO_QUOTA',
      documentation: 'Push the remaining steps before the contract   execution must terminate.\n\n',
      detail: ' \'S   ->   nat : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'STEPS_TO_QUOTA'
    },
    {
      label: 'NOW',
      documentation: 'Push the timestamp of the block whose validation triggered   this execution (does not change during the execution of the   contract).\n\n',
      detail: ' \'S   ->   timestamp : \'SOperations on bytes~~~~~~~~~~~~~~~~~~~Bytes are used for serializing data, in order to check signatures andcompute hashes on them. They can also be used to incorporate data fromthe wild and untyped outside world.',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'NOW'
    },
    {
      label: 'PACK',
      documentation: 'Serializes a piece of data to its optimized   binary representation.\n\n',
      detail: ' \'a : \'S   ->   bytes : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'PACK'
    },
    {
      label: 'UNPACK',
      documentation: 'Deserializes a piece of data, if valid.\n\n',
      detail: ' bytes : \'S   ->   option \'a : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'UNPACK'
    },
    {
      label: 'CONCAT',
      documentation: 'Byte sequence concatenation.\n\nCONCAT / s : t : S  =>  (s ^ t) : S    :: bytes list : \'S   -> bytes : \'S\nCONCAT / {} : S  =>  0x : S\nCONCAT / { s ; <ss> } : S  =>  (s ^ r) : S       where CONCAT / { <ss> } : S  =>  r : S',
      detail: ' bytes : bytes : \'S   -> bytes : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['CONCAT / s : t : S  =>  (s ^ t) : S    :: bytes list : \'S   -> bytes : \'S',
        'CONCAT / {} : S  =>  0x : S',
        'CONCAT / { s ; <ss> } : S  =>  (s ^ r) : S       where CONCAT / { <ss> } : S  =>  r : S'],
      insertText: 'CONCAT'
    },
    {
      label: 'SIZE',
      documentation: 'size of a sequence of bytes.\n\n',
      detail: ' bytes : \'S   ->   nat : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'SIZE'
    },
    {
      label: 'SLICE',
      documentation: 'Bytes access.\n\nSLICE / offset : length : s : S  =>  Some ss : S       where ss is the substring of s at the given offset and of the given length         iff offset and (offset + length) are in bounds\nSLICE / offset : length : s : S  =>  None : S         iff offset or (offset + length) are out of bounds',
      detail: ' nat : nat : bytes : \'S   -> option bytes : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['SLICE / offset : length : s : S  =>  Some ss : S       where ss is the substring of s at the given offset and of the given length         iff offset and (offset + length) are in bounds',
        'SLICE / offset : length : s : S  =>  None : S         iff offset or (offset + length) are out of bounds'],
      insertText: 'SLICE'
    },
    {
      label: 'COMPARE',
      documentation: 'Lexicographic comparison.\n\nCOMPARE / s : t : S  =>  -1 : S        iff s < t\nCOMPARE / s : t : S  =>  0 : S        iff s = t\nCOMPARE / s : t : S  =>  1 : S        iff s > t',
      detail: ' bytes : bytes : \'S   ->   int : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['COMPARE / s : t : S  =>  -1 : S        iff s < t',
        'COMPARE / s : t : S  =>  0 : S        iff s = t',
        'COMPARE / s : t : S  =>  1 : S        iff s > t'],
      insertText: 'COMPARE'
    },
    {
      label: 'HASH_KEY',
      documentation: 'Compute the b58check of a public key.\n\n',
      detail: ' key : \'S   ->   key_hash : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'HASH_KEY'
    },
    {
      label: 'BLAKE2B',
      documentation: 'Compute a cryptographic hash of the value contents using the   Blake2B cryptographic hash function.\n\n',
      detail: ' bytes : \'S   ->   bytes : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'BLAKE2B'
    },
    {
      label: 'SHA256',
      documentation: 'Compute a cryptographic hash of the value contents using the   Sha256 cryptographic hash function.\n\n',
      detail: ' bytes : \'S   ->   bytes : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'SHA256'
    },
    {
      label: 'SHA512',
      documentation: 'Compute a cryptographic hash of the value contents using the   Sha512 cryptographic hash function.\n\n',
      detail: ' bytes : \'S   ->   bytes : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'SHA512'
    },
    {
      label: 'CHECK_SIGNATURE',
      documentation: 'Check that a sequence of bytes has been signed   with a given key.\n\n',
      detail: ' key : signature : bytes : \'S   ->   bool : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: [''],
      insertText: 'CHECK_SIGNATURE'
    },
    {
      label: 'COMPARE',
      documentation: '\n\nCOMPARE / x : y : S  =>  -1 : S        iff x < y\nCOMPARE / x : y : S  =>  0 : S        iff x = y\nCOMPARE / x : y : S  =>  1 : S        iff x > y',
      detail: ' key_hash : key_hash : \'S   ->   int : \'S',
      kind: 'languages.completionItemKind.Function',
      semantics: ['COMPARE / x : y : S  =>  -1 : S        iff x < y',
        'COMPARE / x : y : S  =>  0 : S        iff x = y',
        'COMPARE / x : y : S  =>  1 : S        iff x > y'],
      insertText: 'COMPARE'
    },
    {
      label: 'CMP{EQ|NEQ|LT|GT|LE|GE}',
      documentation: '\n\n CMP(\\op) / S  =>  COMPARE ; (\\op) / S',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: [' CMP(\\op) / S  =>  COMPARE ; (\\op) / S'],
      insertText: 'CMP{EQ|NEQ|LT|GT|LE|GE}'
    },
    {
      label: 'IF{EQ|NEQ|LT|GT|LE|GE}',
      documentation: '\n\n IF(\\op) bt bf / S  =>  (\\op) ; IF bt bf / S',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: [' IF(\\op) bt bf / S  =>  (\\op) ; IF bt bf / S'],
      insertText: 'IF{EQ|NEQ|LT|GT|LE|GE}'
    },
    {
      label: 'IFCMP{EQ|NEQ|LT|GT|LE|GE}',
      documentation: '\n\n IFCMP(\\op) / S  =>  COMPARE ; (\\op) ; IF bt bf / S',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: [' IFCMP(\\op) / S  =>  COMPARE ; (\\op) ; IF bt bf / S'],
      insertText: 'IFCMP{EQ|NEQ|LT|GT|LE|GE}'
    },
    {
      label: 'FAIL',
      documentation: '\n\n FAIL / S  =>  UNIT; FAILWITH / S',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: [' FAIL / S  =>  UNIT; FAILWITH / S'],
      insertText: 'FAIL'
    },
    {
      label: 'ASSERT',
      documentation: '\n\n ASSERT  =>  IF {} {FAIL}',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: [' ASSERT  =>  IF {} {FAIL}'],
      insertText: 'ASSERT'
    },
    {
      label: 'ASSERT_{EQ|NEQ|LT|LE|GT|GE}',
      documentation: '\n\n ASSERT_(\\op)  =>  IF(\\op) {} {FAIL}',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: [' ASSERT_(\\op)  =>  IF(\\op) {} {FAIL}'],
      insertText: 'ASSERT_{EQ|NEQ|LT|LE|GT|GE}'
    },
    {
      label: 'ASSERT_CMP{EQ|NEQ|LT|LE|GT|GE}',
      documentation: '\n\n ASSERT_CMP(\\op)  =>  IFCMP(\\op) {} {FAIL}',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: [' ASSERT_CMP(\\op)  =>  IFCMP(\\op) {} {FAIL}'],
      insertText: 'ASSERT_CMP{EQ|NEQ|LT|LE|GT|GE}'
    },
    {
      label: 'ASSERT_NONE',
      documentation: '\n\n ASSERT_NONE  =>  IF_NONE {} {FAIL}',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: [' ASSERT_NONE  =>  IF_NONE {} {FAIL}'],
      insertText: 'ASSERT_NONE'
    },
    {
      label: 'ASSERT_SOME',
      documentation: '\n\n ASSERT_SOME @x =>  IF_NONE {FAIL} {RENAME @x}',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: [' ASSERT_SOME @x =>  IF_NONE {FAIL} {RENAME @x}'],
      insertText: 'ASSERT_SOME'
    },
    {
      label: 'ASSERT_LEFT',
      documentation: '\n\n ASSERT_LEFT @x =>  IF_LEFT {RENAME @x} {FAIL}',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: [' ASSERT_LEFT @x =>  IF_LEFT {RENAME @x} {FAIL}'],
      insertText: 'ASSERT_LEFT'
    },
    {
      label: 'ASSERT_RIGHT',
      documentation: '\n\n ASSERT_RIGHT @x =>  IF_LEFT {FAIL} {RENAME @x}',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: [' ASSERT_RIGHT @x =>  IF_LEFT {FAIL} {RENAME @x}'],
      insertText: 'ASSERT_RIGHT'
    },
    {
      label: 'DII+P',
      documentation: 'A syntactic sugar for working deeper in the stack.\n\nDII(\rest=I*)P code / S  =>  DIP (DI(\rest)P code) / S',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: ['DII(\rest=I*)P code / S  =>  DIP (DI(\rest)P code) / S'],
      insertText: 'DII+P'
    },
    {
      label: 'DUU+P',
      documentation: 'A syntactic sugar for duplicating the ``n`` th element of   the stack.\n\nDUU(\rest=U*)P / S  =>  DIP (DU(\rest)P) ; SWAP / S',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: ['DUU(\rest=U*)P / S  =>  DIP (DU(\rest)P) ; SWAP / S'],
      insertText: 'DUU+P'
    },
    {
      label: 'P(\\',
      documentation: 'A syntactic sugar   for building nested pairs.\n\nPA(\right)R / S => DIP ((\right)R) ; PAIR / S\nP(\\left)IR / S => PAIR ; (\\left)R / S\nP(\\left)(\right)R => (\right)R ; (\\left)R ; PAIR / S',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: ['PA(\right)R / S => DIP ((\right)R) ; PAIR / S',
        'P(\\left)IR / S => PAIR ; (\\left)R / S',
        'P(\\left)(\right)R => (\right)R ; (\\left)R ; PAIR / S'],
      insertText: 'P(\\'
    },
    {
      label: 'UNP(\\',
      documentation: 'A syntactic sugar   for destructing nested pairs. These macros follow the same convention   as the previous one.\n\nUNPAIR / S => DUP ; CAR ; DIP { CDR } / S\nUNPA(\right)R / S => UNPAIR ; DIP (UN(\right)R) / S\nUNP(\\left)IR / S => UNPAIR ; UN(\\left)R / S\nUNP(\\left)(\right)R => UNPAIR ; UN(\\left)R ; UN(\right)R / S',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: ['UNPAIR / S => DUP ; CAR ; DIP { CDR } / S',
        'UNPA(\right)R / S => UNPAIR ; DIP (UN(\right)R) / S',
        'UNP(\\left)IR / S => UNPAIR ; UN(\\left)R / S',
        'UNP(\\left)(\right)R => UNPAIR ; UN(\\left)R ; UN(\right)R / S'],
      insertText: 'UNP(\\'
    },
    {
      label: 'C[AD]+R',
      documentation: 'A syntactic sugar for accessing fields in nested pairs.\n\nCA(\rest=[AD]+)R / S  =>  CAR ; C(\rest)R / S\nCD(\rest=[AD]+)R / S  =>  CDR ; C(\rest)R / S',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: ['CA(\rest=[AD]+)R / S  =>  CAR ; C(\rest)R / S',
        'CD(\rest=[AD]+)R / S  =>  CDR ; C(\rest)R / S'],
      insertText: 'C[AD]+R'
    },
    {
      label: 'IF_SOME',
      documentation: 'Inspect an optional value.\n\nIF_SOME / (Some a) : S  =>  bt / a : S\nIF_SOME / (None) : S  =>  bf / S',
      detail: ' option \'a : \'S   ->   \'b : \'S       iff   bt \n [ \'a : \'S -> \'b : \'S]             bf \n [ \'S -> \'b : \'S]',
      kind: 'languages.completionItemKind.Function',
      semantics: ['IF_SOME / (Some a) : S  =>  bt / a : S',
        'IF_SOME / (None) : S  =>  bf / S'],
      insertText: 'IF_SOME'
    },
    {
      label: 'SET_CAR',
      documentation: 'Set the left field of a pair.\n\nSET_CAR  =>  CDR ; SWAP ; PAIR',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: ['SET_CAR  =>  CDR ; SWAP ; PAIR'],
      insertText: 'SET_CAR'
    },
    {
      label: 'SET_CDR',
      documentation: 'Set the right field of a pair.\n\nSET_CDR  =>  CAR ; PAIR',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: ['SET_CDR  =>  CAR ; PAIR'],
      insertText: 'SET_CDR'
    },
    {
      label: 'SET_C[AD]+R',
      documentation: 'A syntactic sugar for setting fields in nested   pairs.\n\nSET_CA(\rest=[AD]+)R / S   =>        { DUP ; DIP { CAR ; SET_C(\rest)R } ; CDR ; SWAP ; PAIR } / S\nSET_CD(\rest=[AD]+)R / S   =>        { DUP ; DIP { CDR ; SET_C(\rest)R } ; CAR ; PAIR } / S',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: ['SET_CA(\rest=[AD]+)R / S   =>        { DUP ; DIP { CAR ; SET_C(\rest)R } ; CDR ; SWAP ; PAIR } / S',
        'SET_CD(\rest=[AD]+)R / S   =>        { DUP ; DIP { CDR ; SET_C(\rest)R } ; CAR ; PAIR } / S'],
      insertText: 'SET_C[AD]+R'
    },
    {
      label: 'MAP_CAR',
      documentation: 'Transform the left field of a pair.\n\nMAP_CAR code  =>  DUP ; CDR ; DIP { CAR ; code } ; SWAP ; PAIR',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: ['MAP_CAR code  =>  DUP ; CDR ; DIP { CAR ; code } ; SWAP ; PAIR'],
      insertText: 'MAP_CAR'
    },
    {
      label: 'MAP_CDR',
      documentation: 'Transform the right field of a pair.\n\nMAP_CDR code  =>  DUP ; CDR ; code ; SWAP ; CAR ; PAIR',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: ['MAP_CDR code  =>  DUP ; CDR ; code ; SWAP ; CAR ; PAIR'],
      insertText: 'MAP_CDR'
    },
    {
      label: 'MAP_C[AD]+R',
      documentation: 'A syntactic sugar for transforming fields in   nested pairs.\n\nMAP_CA(\rest=[AD]+)R code / S   =>        { DUP ; DIP { CAR ; MAP_C(\rest)R code } ; CDR ; SWAP ; PAIR } / S\nMAP_CD(\rest=[AD]+)R code / S   =>        { DUP ; DIP { CDR ; MAP_C(\rest)R code } ; CAR ; PAIR } / S',
      detail: '',
      kind: 'languages.completionItemKind.Function',
      semantics: ['MAP_CA(\rest=[AD]+)R code / S   =>        { DUP ; DIP { CAR ; MAP_C(\rest)R code } ; CDR ; SWAP ; PAIR } / S',
        'MAP_CD(\rest=[AD]+)R code / S   =>        { DUP ; DIP { CDR ; MAP_C(\rest)R code } ; CAR ; PAIR } / S'],
      insertText: 'MAP_C[AD]+R'
    }
  ];
}
