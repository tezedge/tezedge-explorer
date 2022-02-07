import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';

@Injectable({
  providedIn: 'root'
})
export class SmartContractsService {

  constructor(private http: HttpClient) { }

  getContracts(): Observable<SmartContract[]> {
    return of(contracts);
  }

  getContractTrace(contract: SmartContract): Observable<any> {
    // this.http.post('https://tezos-lang-server.tzalpha.net//indent', `"${contract.code}"`.split('\n').join('\\n'),
    //   { headers: { 'content-type': 'application/json' } })
    //   .subscribe(res => console.log('INDENT RESPONSE', res));

    const body = this.buildGetTraceRequestBody(`${contract.code}`, contract.codeParameter);
    return this.http.post('http://trace.dev.tezedge.com:8282//get_trace', body);
  }

  getContractTraceMock(): Observable<any> {
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

  private buildGetTraceRequestBody(code: string, parameters: string[] = []): any {
    return {
      code,
      storage: parameters[0] ?? 'Unit',
      balance: 100000,
      parameter: parameters[1] ?? 'Unit',
      gas: 800000000,
      amount: 300,
      self: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
      entrypoint: 'default',
      payer: 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
      source: 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
      contracts: [{
        addr: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
        code,
        storage: parameters[0] ?? 'Unit',
        balance: 100000
      }],
      boot_balances: [100000, 100000, 100000, 100000],
      timestamp: '2018-03-26T13:37:00Z',
      protocol: 'granada'
    };
  }
}


const contracts: SmartContract[] = [
  {
    id: 4015,
    hash: 'tz1JkewnD32ciRzE4oJ9jn2Vm2dvjeK82JxL',
    calls: 54,
    code: 'parameter unit;\nstorage unit;\ncode { CAR;\n       NIL operation;\n       PAIR }'
  },
  {
    id: 8496,
    hash: 'tz1d9h3tviTEqmbjG4ioWjBLpJj7VrRQA4Gs',
    calls: 456,
    code: 'parameter unit ;\nstorage string ;\ncode { DROP ;\n       PUSH string \"This is a smart contract!\" ;\n       NIL operation ;\n       PAIR }',
    codeParameter: ['"test"']
  },
  {
    id: 1441,
    hash: 'tz1UiHHAWxMjpwX9RqdaLi4F1GwNP9LCeLG3',
    calls: 12,
    code: 'parameter string;\nstorage string;\ncode { DUP; CAR; SWAP; CDR; CONCAT; NIL operation; PAIR }',
    codeParameter: ['"Hello from "', '"TezEdge"']
  },
  {
    id: 7600,
    hash: 'tz1bUmvnP948VmDnC96MYqJ9evo4aXgSprZM',
    calls: 567,
    code: 'parameter unit;\nstorage unit;\ncode { DROP;\n       SOURCE;\n       CONTRACT unit;\n       ASSERT_SOME;\n       PUSH mutez 300;\n       UNIT;\n       TRANSFER_TOKENS;\n       DIP { NIL operation };\n       CONS;\n       DIP { UNIT };\n       PAIR;\n       }'
  },
  {
    id: 7600,
    hash: 'tz1PduckPhxtmsuGV1VbgbqgBo3reAqzbsc3',
    calls: 255,
    code: 'parameter unit;\nstorage unit;\ncode { CDR; NIL operation; PAIR}'
  },
  {
    id: 8763,
    hash: 'tz1VYcWWnA5gAc7hVacD34F3443jmhMTDzg',
    calls: 36,
    code: 'parameter unit;\nstorage unit;\ncode { CAR; NIL operation; PAIR }'
  },
  {
    id: 1472,
    hash: 'tz1Zt645cTwMEcAdzgRFMzR5TMPRexZC95sM',
    calls: 36,
    code: 'parameter unit ;\nstorage unit ;\ncode { CAR ;\n       PUSH int 3 ;\n       PUSH int 3 ;\n       IFCMPEQ { DROP } { DROP } ;\n       UNIT;\n       NIL operation ;\n       PAIR }'
  },
  {
    id: 7395,
    hash: 'tz1UXsFZ4ZexmdEGobShY8jKF7tcf4xCeXok',
    calls: 568,
    code: 'parameter (or (map %setMap string int) (set %setSet string));\nstorage (pair (map %keyMap string int) (set %keySet string));\ncode { UNPAIR ;\n       IF_LEFT { SWAP ; CDR ; SWAP ; PAIR } { SWAP ; CAR ; PAIR } ;\n       NIL operation ;\n       PAIR }',
    codeParameter: ['(Pair { Elt \"hello\" -0;  Elt \"hello2\" -0} { \"hello\";  \"hello2\"})', 'Right { \"hello\"; \"hello2\"}']
  },
  {
    id: 1975,
    hash: 'tz1ASxhdMEcAdzgRFMzR5TMPRexZC95sMXXa3',
    calls: 3568,
    code: 'parameter (or (map %setMap key_hash int) (set %setSet key_hash)) ;\nstorage (pair (map %keyMap key_hash int) (set %keySet key_hash)) ;\ncode { UNPAIR ;\n       IF_LEFT { SWAP ; CDR ; SWAP ; PAIR } { SWAP ; CAR ; PAIR } ;\n       NIL operation ;\n       PAIR }',
    codeParameter: ['(Pair { Elt "tz1MSetqa3qdt3W7NTiqnrF8NY6ZhAPo5DAd" -0} { "tz1MSetqa3qdt3W7NTiqnrF8NY6ZhAPo5DAd" })', 'Right { "tz1MSetqa3qdt3W7NTiqnrF8NY6ZhAPo5DAd" }']
  },
  {
    id: 9786,
    hash: 'tz1MMkUljf292eacDSPTWXywujm45NuJJshS',
    calls: 74,
    code: 'parameter unit;\nstorage unit;\ncode { CAR;\n       NIL operation;\n       PAIR }'
  },
  {
    id: 3737,
    hash: 'tz1VFEW92djf292eacDSPTWXywujmASC382d',
    calls: 3856,
    code: 'parameter unit ;\nstorage unit ;\ncode { CAR ;\n       PUSH int 3 ;\n       PUSH int 3 ;\n       IFCMPEQ { DROP } { DROP } ;\n       UNIT;\n       NIL operation ;\n       PAIR }'
  },
  {
    id: 2785,
    hash: 'tz1cxNunA5gAc7hVacDSPTWXywujmhMWEd81',
    calls: 375,
    code: 'parameter unit;\nstorage unit;\ncode { DROP;\n       SOURCE;\n       CONTRACT unit;\n       ASSERT_SOME;\n       PUSH mutez 300;\n       UNIT;\n       TRANSFER_TOKENS;\n       DIP { NIL operation };\n       CONS;\n       DIP { UNIT };\n       PAIR;\n       }'
  },
  {
    id: 7657,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 993,
    code: 'parameter unit;\nstorage unit;\ncode { CDR; NIL operation; PAIR }'
  },
  {
    id: 4166,
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    calls: 95,
    code: 'parameter unit;\nstorage unit;\ncode { CAR;\n       NIL operation;\n       PAIR }'
  },
  {
    id: 6993,
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJe',
    calls: 88,
    codeParameter: [
      'Pair (Pair { Pair (Pair \"kepler://zCT5htke43MjKGP7hwY1rpTLjfvXZMiamXRx45QnGQc36HoaEBAs/zb38S8iCDyGG4fKH6Yw7Hwipn7gXaoZWMRkmMgVAtQZDBFLej\" 0x2fb9dfa0eb302c1f7be2f74ec727e141a144fb3d4f5e47871d9e2585a4e862e8) \"VerifiableCredential\"; Pair (Pair \"kepler://zCT5htke43MjKGP7hwY1rpTLjfvXZMiamXRx45QnGQc36HoaEBAs/zb38SDRpkZYFZYcccaMmhoQjFVkB8An8hYPnDaHJamUdC3uig\" 0x7e6581d2675c580192d84a8be8032c562c4724cabf39cd901020c7bf2c163f4e) \"VerifiableCredential\"; Pair (Pair \"kepler://zCT5htke43MjKGP7hwY1rpTLjfvXZMiamXRx45QnGQc36HoaEBAs/zb38SDuT7PeNu1LpzbcAh4g1p7tLPz2jjG3HYMaMvGNjdEdWu\" 0x97dd54a4678477276ec654259287a34e572b327a19973cfd5a5044a98987ca2c) \"VerifiableCredential\"; Pair (Pair \"kepler://zCT5htke43MjKGP7hwY1rpTLjfvXZMiamXRx45QnGQc36HoaEBAs/zb38SHtVkmgZsLM1Gaq3T7JcADxvs8jCoDrnat3jS2Z8GS18L\" 0x13df04f64e25893659a601e52c7f9c34da7d1df4fa347b264a8c94e221f89317) \"VerifiableCredential\" } \"tzprofiles\") (Pair {} \"tz1QdAAAkvDLRYRF8r3SzbS5hEoR4qZ1syPC\")',
      'Pair { Pair (Pair "hello" 0xdeadc0de) "hello"; Pair (Pair "hello" 0xdeadc0de) "hello"} True'
    ],
    code: 'parameter (pair (list (pair (pair string bytes) string)) bool);\n' +
      'storage (pair\n' +
      '          (pair (set %claims (pair (pair string bytes) string)) (string %contract_type))\n' +
      '          (pair (big_map %metadata string bytes) (address %owner)));\n' +
      'code { UNPAIR ;\n' +
      '       SWAP ;\n' +
      '       DUP ;\n' +
      '       DUG 2 ;\n' +
      '       CDR ;\n' +
      '       CDR ;\n' +
      '       SENDER ;\n' +
      '       COMPARE ;\n' +
      '       NEQ ;\n' +
      '       IF { PUSH string "Unauthorized." ; FAILWITH } {} ;\n' +
      '       PUSH mutez 0 ;\n' +
      '       AMOUNT ;\n' +
      '       COMPARE ;\n' +
      '       GT ;\n' +
      '       IF { PUSH string "Tez not accepted." ; FAILWITH } {} ;\n' +
      '       UNPAIR ;\n' +
      '       DUP 3 ;\n' +
      '       CDR ;\n' +
      '       CDR ;\n' +
      '       DUP 4 ;\n' +
      '       CDR ;\n' +
      '       CAR ;\n' +
      '       PAIR ;\n' +
      '       DUP 4 ;\n' +
      '       CAR ;\n' +
      '       CDR ;\n' +
      '       DIG 4 ;\n' +
      '       CAR ;\n' +
      '       CAR ;\n' +
      '       DIG 3 ;\n' +
      '       ITER { SWAP ; DUP 5 ; DIG 2 ; UPDATE } ;\n' +
      '       DIG 3 ;\n' +
      '       DROP ;\n' +
      '       PAIR ;\n' +
      '       PAIR ;\n' +
      '       NIL operation ;\n' +
      '       PAIR }'
  },
  {
    id: 3822,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 56,
    code: 'parameter unit;\nstorage unit;\ncode { DROP;\n       SOURCE;\n       CONTRACT unit;\n       ASSERT_SOME;\n       PUSH mutez 300;\n       UNIT;\n       TRANSFER_TOKENS;\n       DIP { NIL operation };\n       CONS;\n       DIP { UNIT };\n       PAIR;\n       }'
  },
  {
    id: 3750,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 26,
    code: 'parameter unit;\nstorage unit;\ncode { CDR; NIL operation; PAIR }'
  },
  {
    id: 7251,
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    calls: 1,
    code: 'parameter unit;\nstorage unit;\ncode { CAR;\n       NIL operation;\n       PAIR }'
  },
  {
    id: 2711,
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    calls: 73,
    code: 'parameter unit ;\nstorage unit ;\ncode { CAR ;\n       PUSH int 3 ;\n       PUSH int 3 ;\n       IFCMPEQ { DROP } { DROP } ;\n       UNIT;\n       NIL operation ;\n       PAIR }'
  },
  {
    id: 3758,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 6,
    code: 'parameter unit;\nstorage unit;\ncode { DROP;\n       SOURCE;\n       CONTRACT unit;\n       ASSERT_SOME;\n       PUSH mutez 300;\n       UNIT;\n       TRANSFER_TOKENS;\n       DIP { NIL operation };\n       CONS;\n       DIP { UNIT };\n       PAIR;\n       }'
  },
  {
    id: 4259,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 3,
    code: 'parameter unit;\nstorage unit;\ncode { CDR; NIL operation; PAIR }'
  },
  {
    id: 3755,
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    calls: 74,
    code: 'parameter unit;\nstorage unit;\ncode { CAR;\n       NIL operation;\n       PAIR }'
  },
  {
    id: 5585,
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    calls: 3,
    code: 'parameter unit ;\nstorage unit ;\ncode { CAR ;\n       PUSH int 3 ;\n       PUSH int 3 ;\n       IFCMPEQ { DROP } { DROP } ;\n       UNIT;\n       NIL operation ;\n       PAIR }'
  },
  {
    id: 4273,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 65,
    code: 'parameter unit;\nstorage unit;\ncode { DROP;\n       SOURCE;\n       CONTRACT unit;\n       ASSERT_SOME;\n       PUSH mutez 300;\n       UNIT;\n       TRANSFER_TOKENS;\n       DIP { NIL operation };\n       CONS;\n       DIP { UNIT };\n       PAIR;\n       }'
  },
  {
    id: 7667,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 37,
    code: 'parameter unit;\nstorage unit;\ncode { CDR; NIL operation; PAIR }'
  },
  {
    id: 7878,
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    calls: 63,
    code: 'parameter unit;\nstorage unit;\ncode { CAR;\n       NIL operation;\n       PAIR }'
  },
  {
    id: 7078,
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    calls: 45,
    code: 'parameter unit ;\nstorage unit ;\ncode { CAR ;\n       PUSH int 3 ;\n       PUSH int 3 ;\n       IFCMPEQ { DROP } { DROP } ;\n       UNIT;\n       NIL operation ;\n       PAIR }'
  },
  {
    id: 8008,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 86,
    code: 'parameter unit;\nstorage unit;\ncode { DROP;\n       SOURCE;\n       CONTRACT unit;\n       ASSERT_SOME;\n       PUSH mutez 300;\n       UNIT;\n       TRANSFER_TOKENS;\n       DIP { NIL operation };\n       CONS;\n       DIP { UNIT };\n       PAIR;\n       }'
  },
  {
    id: 9879,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 77,
    code: 'parameter unit;\nstorage unit;\ncode { CDR; NIL operation; PAIR }'
  },
  {
    id: 5376,
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    calls: 2,
    code: 'parameter unit;\nstorage unit;\ncode { CAR;\n       NIL operation;\n       PAIR }'
  },
  {
    id: 5866,
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    calls: 11,
    code: 'parameter unit ;\nstorage unit ;\ncode { CAR ;\n       PUSH int 3 ;\n       PUSH int 3 ;\n       IFCMPEQ { DROP } { DROP } ;\n       UNIT;\n       NIL operation ;\n       PAIR }'
  },
  {
    id: 7336,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 15,
    code: 'parameter unit;\nstorage unit;\ncode { DROP;\n       SOURCE;\n       CONTRACT unit;\n       ASSERT_SOME;\n       PUSH mutez 300;\n       UNIT;\n       TRANSFER_TOKENS;\n       DIP { NIL operation };\n       CONS;\n       DIP { UNIT };\n       PAIR;\n       }'
  },
  {
    id: 5246,
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    calls: 747,
    code: 'parameter unit;\nstorage unit;\ncode { CDR; NIL operation; PAIR }'
  },
];
