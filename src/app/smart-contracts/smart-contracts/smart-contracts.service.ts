import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmartContractsService {

  constructor(private http: HttpClient) { }

  getContracts() {

  }

  getContractTrace(): Observable<any> {
    return of({
        history: [{
          receipt: {
            op: {
              source: 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
              nonce: 0,
              kind: 'transaction',
              amount: '300',
              destination: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG'
            }, result: {
              status: 'success',
              storage: 'Unit',
              trace: [{
                location: {
                  location: {
                    start: { line: 3, column: 5, point: 35, byte: 35 },
                    stop: { line: 14, column: 8, point: 245, byte: 245 }
                  }, expanded: false
                }, gas: '187609', stack: [{ item: '(Pair Unit Unit)' }]
              }, {
                location: {
                  location: {
                    start: { line: 3, column: 7, point: 37, byte: 37 },
                    stop: { line: 3, column: 11, point: 41, byte: 41 }
                  }, expanded: false
                }, gas: '187609', stack: []
              }, {
                location: {
                  location: {
                    start: { line: 4, column: 7, point: 50, byte: 50 },
                    stop: { line: 4, column: 13, point: 56, byte: 56 }
                  }, expanded: false
                }, gas: '187609', stack: [{ item: '"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx"', annot: '@source' }]
              }, {
                location: {
                  location: {
                    start: { line: 5, column: 7, point: 65, byte: 65 },
                    stop: { line: 5, column: 20, point: 78, byte: 78 }
                  }, expanded: false
                }, gas: '177576', stack: [{ item: '(Some "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx")', annot: '@source.contract' }]
              }, {
                location: {
                  location: {
                    start: { line: 6, column: 7, point: 87, byte: 87 },
                    stop: { line: 6, column: 18, point: 98, byte: 98 }
                  }, expanded: true
                }, gas: '177575', stack: [{ item: '"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx"', annot: '@source.contract.some' }]
              }, {
                location: {
                  location: {
                    start: { line: 6, column: 7, point: 87, byte: 87 },
                    stop: { line: 6, column: 18, point: 98, byte: 98 }
                  }, expanded: false
                }, gas: '177575', stack: [{ item: '"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx"', annot: '@source.contract.some' }]
              }, {
                location: {
                  location: {
                    start: { line: 7, column: 7, point: 107, byte: 107 },
                    stop: { line: 7, column: 21, point: 121, byte: 121 }
                  }, expanded: false
                }, gas: '177575', stack: [{ item: '300' }, { item: '"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx"', annot: '@source.contract.some' }]
              }, {
                location: {
                  location: {
                    start: { line: 8, column: 7, point: 130, byte: 130 },
                    stop: { line: 8, column: 11, point: 134, byte: 134 }
                  }, expanded: false
                },
                gas: '177574',
                stack: [{ item: 'Unit' }, { item: '300' }, { item: '"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx"', annot: '@source.contract.some' }]
              }, {
                location: {
                  location: {
                    start: { line: 9, column: 7, point: 143, byte: 143 },
                    stop: { line: 9, column: 22, point: 158, byte: 158 }
                  }, expanded: false
                },
                gas: '177556',
                stack: [{ item: '0x01b31ba9bfde1dd3598b5a10b17fe8162a3de554e100000101ac02000002298c03ed7d454a101eb7022bc95f7e5f41ac7800' }]
              }, {
                location: {
                  location: {
                    start: { line: 10, column: 13, point: 173, byte: 173 },
                    stop: { line: 10, column: 26, point: 186, byte: 186 }
                  }, expanded: false
                }, gas: '177555', stack: [{ item: '{}' }]
              }, {
                location: {
                  location: {
                    start: { line: 10, column: 11, point: 171, byte: 171 },
                    stop: { line: 10, column: 28, point: 188, byte: 188 }
                  }, expanded: false
                }, gas: '177555', stack: [{ item: '{}' }]
              }, {
                location: {
                  location: {
                    start: { line: 10, column: 7, point: 167, byte: 167 },
                    stop: { line: 10, column: 28, point: 188, byte: 188 }
                  }, expanded: false
                },
                gas: '177555',
                stack: [{ item: '0x01b31ba9bfde1dd3598b5a10b17fe8162a3de554e100000101ac02000002298c03ed7d454a101eb7022bc95f7e5f41ac7800' }, { item: '{}' }]
              }, {
                location: {
                  location: {
                    start: { line: 11, column: 7, point: 197, byte: 197 },
                    stop: { line: 11, column: 11, point: 201, byte: 201 }
                  }, expanded: false
                },
                gas: '177554',
                stack: [{ item: '{ 0x01b31ba9bfde1dd3598b5a10b17fe8162a3de554e100000101ac02000002298c03ed7d454a101eb7022bc95f7e5f41ac7800 }' }]
              }, {
                location: {
                  location: {
                    start: { line: 12, column: 13, point: 216, byte: 216 },
                    stop: { line: 12, column: 17, point: 220, byte: 220 }
                  }, expanded: false
                }, gas: '177554', stack: [{ item: 'Unit' }]
              }, {
                location: {
                  location: {
                    start: { line: 12, column: 11, point: 214, byte: 214 },
                    stop: { line: 12, column: 19, point: 222, byte: 222 }
                  }, expanded: false
                }, gas: '177553', stack: [{ item: 'Unit' }]
              }, {
                location: {
                  location: {
                    start: { line: 12, column: 7, point: 210, byte: 210 },
                    stop: { line: 12, column: 19, point: 222, byte: 222 }
                  }, expanded: false
                },
                gas: '177553',
                stack: [{ item: '{ 0x01b31ba9bfde1dd3598b5a10b17fe8162a3de554e100000101ac02000002298c03ed7d454a101eb7022bc95f7e5f41ac7800 }' }, { item: 'Unit' }]
              }, {
                location: {
                  location: {
                    start: { line: 13, column: 7, point: 231, byte: 231 },
                    stop: { line: 13, column: 11, point: 235, byte: 235 }
                  }, expanded: false
                },
                gas: '177553',
                stack: [{ item: '(Pair { 0x01b31ba9bfde1dd3598b5a10b17fe8162a3de554e100000101ac02000002298c03ed7d454a101eb7022bc95f7e5f41ac7800 }\n      Unit)' }]
              }, {
                location: {
                  location: {
                    start: { line: 0, column: 0, point: 0, byte: 0 },
                    stop: { line: 0, column: 0, point: 0, byte: 0 }
                  }, expanded: true
                },
                gas: '177553',
                stack: [{ item: '(Pair { 0x01b31ba9bfde1dd3598b5a10b17fe8162a3de554e100000101ac02000002298c03ed7d454a101eb7022bc95f7e5f41ac7800 }\n      Unit)' }]
              }],
              kind: 'transaction',
              balance_updates: [{ kind: 'contract', contract: 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx', change: '-300' }, {
                kind: 'contract',
                contract: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
                change: '300'
              }],
              consumed_gas: '22577',
              paid_storage_size_diff: '0',
              storage_size: '99'
            }
          }
        }, {
          receipt: {
            op: {
              source: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
              nonce: 1,
              kind: 'transaction',
              amount: '300',
              destination: 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx'
            },
            result: {
              status: 'success',
              kind: 'transaction',
              balance_updates: [{ kind: 'contract', contract: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG', change: '-300' }, {
                kind: 'contract',
                contract: 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
                change: '300'
              }],
              consumed_gas: '10207',
              paid_storage_size_diff: '0',
              storage_size: '0'
            }
          }
        }]
      }
    );
  }
}
