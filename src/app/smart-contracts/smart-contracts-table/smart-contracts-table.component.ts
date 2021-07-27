import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-smart-contracts-table',
  templateUrl: './smart-contracts-table.component.html',
  styleUrls: ['./smart-contracts-table.component.scss']
})
export class SmartContractsTableComponent implements OnInit {

  contractList = CONTRACT_LIST;
  activeContract = CONTRACT_LIST[5];

  constructor() { }

  ngOnInit(): void {
  }

  selectContract(newContract: any): void {
    this.activeContract = newContract;
  }

}

const CONTRACT_LIST = [
  {
    id: 0,
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    calls: 138
  },
  {
    id: 1,
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    calls: 120
  },
  {
    id: 2,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 143
  },
  {
    id: 3,
    hash: 'Qm1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
    calls: 66
  },
  {
    id: 4,
    hash: 'tz1b7tUupMgCNw2cCLpKTkSD1NZzB5TkP2sv',
    calls: 184
  },
  {
    id: 5,
    hash: 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN',
    calls: 404
  },
  {
    id: 6,
    hash: 'Qm1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
    calls: 407
  },
  {
    id: 7,
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    calls: 270
  },
  {
    id: 8,
    hash: 'tz1b7tUupMgCNw2cCLpKTkSD1NZzB5TkP2sv',
    calls: 195
  },
  {
    id: 9,
    hash: 'Qm1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
    calls: 356
  },
  {
    id: 10,
    hash: 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN',
    calls: 377
  },
  {
    id: 11,
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    calls: 55
  },
  {
    id: 12,
    hash: 'tz1b7tUupMgCNw2cCLpKTkSD1NZzB5TkP2sv',
    calls: 489
  },
  {
    id: 13,
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    calls: 270
  },
  {
    id: 14,
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    calls: 411
  },
  {
    id: 15,
    hash: 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN',
    calls: 281
  },
  {
    id: 16,
    hash: 'tz1b7tUupMgCNw2cCLpKTkSD1NZzB5TkP2sv',
    calls: 241
  },
  {
    id: 17,
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    calls: 312
  },
  {
    id: 18,
    hash: 'Qm1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
    calls: 30
  },
  {
    id: 19,
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    calls: 129
  },
  {
    id: 20,
    hash: 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN',
    calls: 46
  },
  {
    id: 21,
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    calls: 450
  },
  {
    id: 22,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 309
  },
  {
    id: 23,
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    calls: 14
  },
  {
    id: 24,
    hash: 'tz1b7tUupMgCNw2cCLpKTkSD1NZzB5TkP2sv',
    calls: 400
  },
  {
    id: 25,
    hash: 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN',
    calls: 381
  },
  {
    id: 26,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 79
  },
  {
    id: 27,
    hash: 'Qm1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
    calls: 25
  },
  {
    id: 28,
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    calls: 178
  },
  {
    id: 29,
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    calls: 155
  },
  {
    id: 30,
    hash: 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN',
    calls: 270
  },
  {
    id: 31,
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    calls: 301
  },
  {
    id: 32,
    hash: 'tz1b7tUupMgCNw2cCLpKTkSD1NZzB5TkP2sv',
    calls: 90
  },
  {
    id: 33,
    hash: 'Qm1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
    calls: 384
  },
  {
    id: 34,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 395
  },
  {
    id: 35,
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    calls: 262
  },
  {
    id: 36,
    hash: 'tz1b7tUupMgCNw2cCLpKTkSD1NZzB5TkP2sv',
    calls: 415
  },
  {
    id: 37,
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    calls: 351
  },
  {
    id: 38,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 168
  },
  {
    id: 39,
    hash: 'Qm1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
    calls: 241
  },
  {
    id: 40,
    hash: 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN',
    calls: 117
  },
  {
    id: 41,
    hash: 'LLojslkdijv8efeuluGWasjd0990jaeJEle',
    calls: 484
  },
  {
    id: 42,
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    calls: 45
  },
  {
    id: 43,
    hash: 'JKef0se9fskfsfekuh8723jf32FJEle',
    calls: 431
  },
  {
    id: 44,
    hash: 'tz1b7tUupMgCNw2cCLpKTkSD1NZzB5TkP2sv',
    calls: 46
  },
  {
    id: 45,
    hash: 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN',
    calls: 141
  },
  {
    id: 46,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 238
  },
  {
    id: 47,
    hash: 'KJJ99EFWJfeuluGWR8ulgwrfejEfew9FJEle',
    calls: 450
  },
  {
    id: 48,
    hash: 'tz1b7tUupMgCNw2cCLpKTkSD1NZzB5TkP2sv',
    calls: 122
  },
  {
    id: 49,
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    calls: 471
  },
  {
    id: 50,
    hash: 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN',
    calls: 393
  },
  {
    id: 51,
    hash: 'Qm1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
    calls: 361
  },
  {
    id: 52,
    hash: 'tz1b7tUupMgCNw2cCLpKTkSD1NZzB5TkP2sv',
    calls: 118
  },
  {
    id: 53,
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    calls: 385
  },
  {
    id: 54,
    hash: 'Qm1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
    calls: 306
  },
  {
    id: 55,
    hash: 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN',
    calls: 278
  },
  {
    id: 56,
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    calls: 362
  },
  {
    id: 57,
    hash: 'Qm1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
    calls: 239
  },
  {
    id: 58,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 278
  },
  {
    id: 59,
    hash: 'BLkkkSJLKESWFuEFS0gsrli843rger3FJEle',
    calls: 82
  },
  {
    id: 60,
    hash: 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN',
    calls: 455
  }
];
