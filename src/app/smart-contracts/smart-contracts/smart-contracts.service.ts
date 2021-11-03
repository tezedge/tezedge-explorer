import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, forkJoin, mergeMap, Observable, of, switchMap } from 'rxjs';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import { catchError, map } from 'rxjs/operators';
import { emitMicheline, Parser } from '@taquito/michel-codec';
import { SmartContractResult } from '@shared/types/smart-contracts/smart-contract-result.type';
import { SmartContractTrace } from '@shared/types/smart-contracts/smart-contract-trace.type';
import { collectScriptElements } from '@smart-contracts/smart-contracts/smart-contracts.factory';
import { SmartContractDebugPoint } from '@shared/types/smart-contracts/smart-contract-debug-point.type';


@Injectable({
  providedIn: 'root'
})
export class SmartContractsService {

  private readonly parser: Parser = new Parser();

  constructor(private http: HttpClient) { }

  getContracts(api: string, hash: string): Observable<{ contracts: Partial<SmartContract>[], previousBlockHash: string }> {
    // return of({ contracts: mockContracts, previousBlockHash: 'asd' });
    return this.http.get<any>(`${api}/chains/main/blocks/${hash}`).pipe(
      map((response) => this.mapGetContracts(response)),
      mergeMap(({ contracts, previousBlockHash }: { contracts: Partial<SmartContract>[], previousBlockHash: string }) =>
        forkJoin(
          contracts.map((partialContract: Partial<SmartContract>) => {
            // get CODE OBJ and STORAGE OBJ - script RPC
            return this.getContractCodeForTable(api, previousBlockHash, partialContract)
              .pipe(
                // get BALANCE - /balance RPC
                switchMap((fullContract: SmartContract) =>
                  this.http.get(`${api}/chains/main/blocks/${previousBlockHash}/context/contracts/${fullContract.hash}/balance`).pipe(
                    map((balance: string) => ({ ...fullContract, balance }))
                  )
                ),
                // get TRACE CONSUMPTION - trace_code RPC
                switchMap((fullContract: SmartContract) => {
                  const getConsumedTraceGas = (trace): number => {
                    if (trace.length > 0) {
                      return SmartContractsService.getConsumedGasForResult(trace, fullContract.gasLimit);
                    }
                  };
                  const body = this.buildGetTraceRequestBody(fullContract);
                  return this.http.post(`${api}/chains/main/blocks/${previousBlockHash}/helpers/scripts/trace_code`, body).pipe(
                    map((traceCodeResponse: any) => {
                      fullContract.isSameStorage =
                        this.jsonStringifyOrder(fullContract.blockStorage, 0)
                        === this.jsonStringifyOrder(traceCodeResponse.storage, 0);

                      fullContract.isSameBigMaps =
                        this.jsonStringifyOrder(fullContract.blockBigMaps, 0) === this.jsonStringifyOrder(traceCodeResponse.lazy_storage_diff, 0);

                      return {
                        traceStorage: traceCodeResponse.storage,
                        traceBigMaps: traceCodeResponse.lazy_storage_diff,
                        traceConsumedGas: getConsumedTraceGas(traceCodeResponse.trace),
                        status: traceCodeResponse.trace ? 'Success' : ''
                      };
                    }),
                    catchError(err => {
                      if (!err.error) { return EMPTY; }
                      return of({
                        traceStorage: null,
                        traceBigMaps: null,
                        traceConsumedGas: getConsumedTraceGas(err.error.reduce((acc, curr) => [...acc, ...(curr?.trace || [])], [])),
                        status: JSON.stringify(err.error[err.error.length - 1]?.with) || 'Failed'
                      });
                    }),
                    map((traceResponse: { traceConsumedGas: number, status: string, traceStorage: object, traceBigMaps: object }) => ({
                      ...fullContract,
                      traceStorage: traceResponse.traceStorage,
                      traceBigMaps: traceResponse.traceBigMaps,
                      traceConsumedGas: traceResponse.traceConsumedGas,
                      traceExecutionStatus: traceResponse.status
                    }))
                  );
                }),
              );
          })
        ).pipe(
          map((finalContracts: Partial<SmartContract>[]) => ({ contracts: finalContracts, previousBlockHash }))
        )
      )
    );
  }

  private mapGetContracts(response: any): { contracts: Partial<SmartContract>[], previousBlockHash: string } {
    const contracts: Partial<SmartContract>[] = [];
    response.operations[3].forEach(operation => {
      operation.contents.forEach(contract => {
        if (contract.destination?.startsWith('KT1') && contract.kind === 'transaction') {
          contracts.push({
            hash: contract.destination,
            id: contracts.length,
            entrypoint: contract.parameters?.entrypoint,
            chainId: operation.chain_id,
            amount: contract.amount,
            gasLimit: contract.gas_limit,
            parameter: contract.parameters ? this.formatMichelsonCode(contract.parameters.value) : null,
            parameterObj: contract.parameters?.value,
            source: contract.source,
            totalConsumedGas: Number(contract.metadata.operation_result.consumed_milligas),
            blockExecutionStatus: contract.metadata.operation_result.status,
            blockStorage: contract.metadata.operation_result.storage,
            blockBigMaps: contract.metadata.operation_result.lazy_storage_diff,
          });
        }
      });
    });
    return { contracts, previousBlockHash: response.header.predecessor };
  }

  private getContractCodeForTable(api: string, blockHash: string, contract: Partial<SmartContract>): Observable<SmartContract> {
    return this.http.get<{ code: object, storage: object }>(`${api}/chains/main/blocks/${blockHash}/context/contracts/${contract.hash}/script`)
      .pipe(
        map((script: { code: object, storage: object }) => ({
          codeObj: script.code,
          storageObj: script.storage,
          id: contract.id,
          hash: contract.hash,
          entrypoint: contract.entrypoint,
          parameter: contract.parameter,
          parameterObj: contract.parameterObj,
          source: contract.source,
          chainId: contract.chainId,
          amount: contract.amount,
          gasLimit: contract.gasLimit,
          balance: contract.balance,
          totalConsumedGas: contract.totalConsumedGas,
          blockExecutionStatus: contract.blockExecutionStatus,
          blockStorage: contract.blockStorage,
          blockBigMaps: contract.blockBigMaps,
        })),
        catchError(() => EMPTY)
      );
  }

  getContractCode(api: string, blockHash: string, contract: Partial<SmartContract>): Observable<SmartContract> {
    // return of({} as any);
    return this.http.get<{ code: object, storage: object }>(`${api}/chains/main/blocks/${blockHash}/context/contracts/${contract.hash}/script`)
      .pipe(
        map((script: { code: object, storage: object }) => ({
          code: this.formatMichelsonCode(script.code),
          codeObj: script.code,
          storageObj: script.storage,
          storage: this.formatMichelsonCode(script.storage),

          id: contract.id,
          hash: contract.hash,
          entrypoint: contract.entrypoint,
          parameter: contract.parameter,
          parameterObj: contract.parameterObj,
          source: contract.source,
          chainId: contract.chainId,
          amount: contract.amount,
          gasLimit: contract.gasLimit,
          balance: contract.balance,
          totalConsumedGas: contract.totalConsumedGas,
          blockExecutionStatus: contract.blockExecutionStatus,
          blockStorage: contract.blockStorage,
          blockBigMaps: contract.blockBigMaps,
          traceStorage: contract.traceStorage,
          traceBigMaps: contract.traceBigMaps,
          isSameBigMaps: contract.isSameBigMaps,
          isSameStorage: contract.isSameStorage,
        })),
        catchError(() => EMPTY)
      );
  }

  getContractTrace(api: string, blockHash: string, contract: SmartContract): Observable<{ trace: SmartContractTrace[], gasTrace: number[], result: SmartContractResult }> {

    const body = this.buildGetTraceRequestBody(contract);
    // console.log(this.jsonStringifyOrder(contract.blockStorage, 0));
    // console.log(this.jsonStringifyOrder(contract.traceStorage, 0));
    // console.log(this.jsonStringifyOrder(contract.blockStorage, 0) === this.jsonStringifyOrder(contract.storageObj, 0));

    // return this.http.post<any>(`${api}/chains/main/blocks/BKv2urEM4eucDZBdoULrCG1CEE6gS77KzK8viHUUfMCx4jss48m/helpers/scripts/trace_code`, body).pipe(
    return this.http.post<any>(`${api}/chains/main/blocks/${blockHash}/helpers/scripts/trace_code`, body).pipe(
      map((response) => this.mapNewGetContractTrace(response, contract)),
      catchError(err => of(this.mapNewGetContractTrace(err.error, contract)))
    );
  }

  private jsonStringifyOrder(obj, space): string {
    const allKeys = [];
    const seen = {};
    JSON.stringify(obj, (key, value) => {
      if (!(key in seen)) {
        allKeys.push(key);
        seen[key] = null;
      }
      return value;
    });
    allKeys.sort();
    return JSON.stringify(obj, allKeys, space);
  }

  private mapNewGetContractTrace(response: any, contract: SmartContract): { trace: SmartContractTrace[], gasTrace: number[], result: SmartContractResult } {
    let trace: SmartContractTrace[];
    let gasTrace: number[];
    const result: SmartContractResult = { executionInfo: response };
    const traceResponse = response.trace ?? response.reduce((acc, curr) => [...acc, ...(curr?.trace || [])], []);
    if (traceResponse.length > 0) {
      trace = this.getTrace(traceResponse, contract);
      result.consumedGas = SmartContractsService.getConsumedGasForResult(traceResponse, contract.gasLimit);
      gasTrace = this.getGasTrace(contract, trace);
    }

    return { trace, gasTrace, result };
  }

  private getGasTrace(contract: SmartContract, trace: SmartContractTrace[]): number[] {
    const linesOfCode = contract.code.split('\n').length;
    const gasTrace: number[] = [];

    trace.forEach(tr => {
      gasTrace[tr.start.line - 1] = tr.gas + (gasTrace[tr.start.line - 1] ?? 0);
    });
    for (let i = 0; i < linesOfCode; i++) {
      gasTrace[i] = gasTrace[i] ?? 0;
    }
    return gasTrace;
  }

  private static getConsumedGasForResult(trace: SmartContractTrace[], gasLimit: number | string): number {
    return (Number('8000000000') * 1000) - Number(trace[trace.length - 1].gas);
  }

  private getTrace(traceResponse: any[], contract: SmartContract): SmartContractTrace[] {
    const symbolsArray = this.parseContractDebug(contract.code);
    const noLocation = { point: 0, line: 0, column: 0 };

    const linesConsumingGas = traceResponse.map(tr => ({
      gas: Number(tr.gas),
      stack: tr.stack.map(st => ({ item: JSON.stringify(st.item), annot: st.annot })),
      start: symbolsArray[tr.location]?.start ?? noLocation,
      stop: symbolsArray[tr.location]?.end ?? noLocation,
      location: tr.location,
    }));

    return linesConsumingGas.map((tr, i: number) => ({
      ...tr,
      gas: linesConsumingGas[i - 1] ? (linesConsumingGas[i - 1].gas - tr.gas) : 0
    }));
  }

  private parseContractDebug(contractCode: string): { first: number, last: number, start: SmartContractDebugPoint, end: SmartContractDebugPoint }[] {
    const parsedCode = this.parser.parseScript(contractCode);
    const output = collectScriptElements(contractCode, parsedCode);
    return output.map(entry => entry[Object.getOwnPropertySymbols(entry)[0]]);
  }

  private buildGetTraceRequestBody(contract: SmartContract): any {
    return {
      // storage: 'test',
      // input: 'Unit',
      // script: this.formatMichelsonCode(contract.codeObj),
      script: contract.codeObj,
      storage: contract.storageObj,
      input: contract.parameterObj ?? {},
      source: contract.source,
      payer: contract.source,
      gas: '8000000000',
      amount: contract.amount,
      chain_id: contract.chainId,
      balance: contract.balance,
      entrypoint: contract.entrypoint ?? 'default',
      unparsing_mode: 'Optimized'
    };
  }

  private formatMichelsonCode(code: object): string {
    return emitMicheline(this.parser.parseJSON(code), { indent: '    ', newline: '\n', });
  }
}

const mockContracts: SmartContract[] = [
  {
    hash: 'KT18p94vjkkHYY3nPmernmgVR7HdZFzE7NAk',
    code: 'parameter (or\n            (or (or (pair %approve (address %spender) (nat %value)) (unit %default))\n                (or\n                  (pair %getAllowance (pair (address %owner) (address %spender))\n                                      (contract nat))\n                  (pair %getBalance (address %owner) (contract nat))))\n            (or\n              (or (contract %getReserves (pair nat nat))\n                  (pair %getTotalSupply unit (contract nat)))\n              (or (pair %transfer (address %from) (address %to) (nat %value))\n                  (or %use\n                    (or\n                      (or\n                        (pair %divestLiquidity (pair (nat %min_tez) (nat %min_tokens))\n                                               (nat %shares))\n                        (nat %initializeExchange))\n                      (or (nat %investLiquidity)\n                          (pair %tezToTokenPayment (nat %min_out) (address %receiver))))\n                    (or\n                      (or\n                        (pair %tokenToTezPayment (pair (nat %amount) (nat %min_out))\n                                                 (address %receiver))\n                        (pair %veto (nat %value) (address %voter)))\n                      (or\n                        (pair %vote (pair (key_hash %candidate) (nat %value))\n                                    (address %voter))\n                        (address %withdrawProfit)))))));\nstorage (pair\n          (pair\n            (big_map %dex_lambdas nat\n                                  (lambda\n                                    (pair\n                                      (pair\n                                        (or\n                                          (or\n                                            (or\n                                              (pair %divestLiquidity\n                                                (pair (nat %min_tez) (nat %min_tokens))\n                                                (nat %shares))\n                                              (nat %initializeExchange))\n                                            (or (nat %investLiquidity)\n                                                (pair %tezToTokenPayment (nat %min_out)\n                                                                         (address %receiver))))\n                                          (or\n                                            (or\n                                              (pair %tokenToTezPayment\n                                                (pair (nat %amount) (nat %min_out))\n                                                (address %receiver))\n                                              (pair %veto (nat %value) (address %voter)))\n                                            (or\n                                              (pair %vote\n                                                (pair (key_hash %candidate) (nat %value))\n                                                (address %voter))\n                                              (address %withdrawProfit))))\n                                        (pair\n                                          (pair\n                                            (pair\n                                              (pair (address %baker_validator)\n                                                    (option %current_candidate key_hash))\n                                              (option %current_delegated key_hash)\n                                              (timestamp %last_update_time))\n                                            (pair (timestamp %last_veto)\n                                                  (big_map %ledger address\n                                                                   (pair\n                                                                     (pair\n                                                                       (map %allowances\n                                                                         address\n                                                                         nat)\n                                                                       (nat %balance))\n                                                                     (nat %frozen_balance))))\n                                            (timestamp %period_finish)\n                                            (nat %reward))\n                                          (pair\n                                            (pair (nat %reward_paid)\n                                                  (nat %reward_per_sec))\n                                            (nat %reward_per_share)\n                                            (nat %tez_pool))\n                                          (pair (address %token_address)\n                                                (nat %token_pool))\n                                          (nat %total_reward)\n                                          (nat %total_supply))\n                                        (pair\n                                          (pair (nat %total_votes)\n                                                (big_map %user_rewards address\n                                                                       (pair\n                                                                         (nat %reward)\n                                                                         (nat %reward_paid))))\n                                          (nat %veto)\n                                          (big_map %vetos key_hash timestamp))\n                                        (big_map %voters address\n                                                         (pair\n                                                           (pair\n                                                             (option %candidate key_hash)\n                                                             (timestamp %last_veto))\n                                                           (nat %veto)\n                                                           (nat %vote)))\n                                        (big_map %votes key_hash nat))\n                                      address)\n                                    (pair (list operation)\n                                          (pair\n                                            (pair\n                                              (pair\n                                                (pair (address %baker_validator)\n                                                      (option %current_candidate key_hash))\n                                                (option %current_delegated key_hash)\n                                                (timestamp %last_update_time))\n                                              (pair (timestamp %last_veto)\n                                                    (big_map %ledger address\n                                                                     (pair\n                                                                       (pair\n                                                                         (map %allowances\n                                                                           address\n                                                                           nat)\n                                                                         (nat %balance))\n                                                                       (nat %frozen_balance))))\n                                              (timestamp %period_finish)\n                                              (nat %reward))\n                                            (pair\n                                              (pair (nat %reward_paid)\n                                                    (nat %reward_per_sec))\n                                              (nat %reward_per_share)\n                                              (nat %tez_pool))\n                                            (pair (address %token_address)\n                                                  (nat %token_pool))\n                                            (nat %total_reward)\n                                            (nat %total_supply))\n                                          (pair\n                                            (pair (nat %total_votes)\n                                                  (big_map %user_rewards address\n                                                                         (pair\n                                                                           (nat %reward)\n                                                                           (nat %reward_paid))))\n                                            (nat %veto)\n                                            (big_map %vetos key_hash timestamp))\n                                          (big_map %voters address\n                                                           (pair\n                                                             (pair\n                                                               (option %candidate key_hash)\n                                                               (timestamp %last_veto))\n                                                             (nat %veto)\n                                                             (nat %vote)))\n                                          (big_map %votes key_hash nat))))\n            (big_map %metadata string bytes))\n          (pair %storage\n            (pair\n              (pair\n                (pair\n                  (pair (address %baker_validator) (option %current_candidate key_hash))\n                  (option %current_delegated key_hash)\n                  (timestamp %last_update_time))\n                (pair (timestamp %last_veto)\n                      (big_map %ledger address\n                                       (pair\n                                         (pair (map %allowances address nat)\n                                               (nat %balance))\n                                         (nat %frozen_balance))))\n                (timestamp %period_finish)\n                (nat %reward))\n              (pair (pair (nat %reward_paid) (nat %reward_per_sec))\n                    (nat %reward_per_share)\n                    (nat %tez_pool))\n              (pair (address %token_address) (nat %token_pool))\n              (nat %total_reward)\n              (nat %total_supply))\n            (pair\n              (pair (nat %total_votes)\n                    (big_map %user_rewards address\n                                           (pair (nat %reward) (nat %reward_paid))))\n              (nat %veto)\n              (big_map %vetos key_hash timestamp))\n            (big_map %voters address\n                             (pair\n                               (pair (option %candidate key_hash) (timestamp %last_veto))\n                               (nat %veto)\n                               (nat %vote)))\n            (big_map %votes key_hash nat))\n          (big_map %token_lambdas nat\n                                  (lambda\n                                    (pair\n                                      (pair\n                                        (or\n                                          (or\n                                            (or\n                                              (pair %iApprove (address %spender)\n                                                              (nat %value))\n                                              (pair %iGetAllowance\n                                                (pair (address %owner)\n                                                      (address %spender))\n                                                (contract nat)))\n                                            (or\n                                              (pair %iGetBalance (address %owner)\n                                                                 (contract nat))\n                                              (pair %iGetTotalSupply unit (contract nat))))\n                                          (pair %iTransfer (address %from) (address %to)\n                                                           (nat %value)))\n                                        (pair\n                                          (pair\n                                            (pair\n                                              (pair (address %baker_validator)\n                                                    (option %current_candidate key_hash))\n                                              (option %current_delegated key_hash)\n                                              (timestamp %last_update_time))\n                                            (pair (timestamp %last_veto)\n                                                  (big_map %ledger address\n                                                                   (pair\n                                                                     (pair\n                                                                       (map %allowances\n                                                                         address\n                                                                         nat)\n                                                                       (nat %balance))\n                                                                     (nat %frozen_balance))))\n                                            (timestamp %period_finish)\n                                            (nat %reward))\n                                          (pair\n                                            (pair (nat %reward_paid)\n                                                  (nat %reward_per_sec))\n                                            (nat %reward_per_share)\n                                            (nat %tez_pool))\n                                          (pair (address %token_address)\n                                                (nat %token_pool))\n                                          (nat %total_reward)\n                                          (nat %total_supply))\n                                        (pair\n                                          (pair (nat %total_votes)\n                                                (big_map %user_rewards address\n                                                                       (pair\n                                                                         (nat %reward)\n                                                                         (nat %reward_paid))))\n                                          (nat %veto)\n                                          (big_map %vetos key_hash timestamp))\n                                        (big_map %voters address\n                                                         (pair\n                                                           (pair\n                                                             (option %candidate key_hash)\n                                                             (timestamp %last_veto))\n                                                           (nat %veto)\n                                                           (nat %vote)))\n                                        (big_map %votes key_hash nat))\n                                      address)\n                                    (pair (list operation)\n                                          (pair\n                                            (pair\n                                              (pair\n                                                (pair (address %baker_validator)\n                                                      (option %current_candidate key_hash))\n                                                (option %current_delegated key_hash)\n                                                (timestamp %last_update_time))\n                                              (pair (timestamp %last_veto)\n                                                    (big_map %ledger address\n                                                                     (pair\n                                                                       (pair\n                                                                         (map %allowances\n                                                                           address\n                                                                           nat)\n                                                                         (nat %balance))\n                                                                       (nat %frozen_balance))))\n                                              (timestamp %period_finish)\n                                              (nat %reward))\n                                            (pair\n                                              (pair (nat %reward_paid)\n                                                    (nat %reward_per_sec))\n                                              (nat %reward_per_share)\n                                              (nat %tez_pool))\n                                            (pair (address %token_address)\n                                                  (nat %token_pool))\n                                            (nat %total_reward)\n                                            (nat %total_supply))\n                                          (pair\n                                            (pair (nat %total_votes)\n                                                  (big_map %user_rewards address\n                                                                         (pair\n                                                                           (nat %reward)\n                                                                           (nat %reward_paid))))\n                                            (nat %veto)\n                                            (big_map %vetos key_hash timestamp))\n                                          (big_map %voters address\n                                                           (pair\n                                                             (pair\n                                                               (option %candidate key_hash)\n                                                               (timestamp %last_veto))\n                                                             (nat %veto)\n                                                             (nat %vote)))\n                                          (big_map %votes key_hash nat)))));\ncode { DUP ;\n       CDR ;\n       SWAP ;\n       CAR ;\n       SELF ;\n       ADDRESS ;\n       SWAP ;\n       IF_LEFT\n         { IF_LEFT\n             { IF_LEFT\n                 { DIG 2 ;\n                   PUSH nat 1 ;\n                   PAIR ;\n                   DUG 2 ;\n                   LEFT (pair (pair address address) (contract nat)) ;\n                   LEFT (or (pair address (contract nat)) (pair unit (contract nat))) ;\n                   LEFT (pair address (pair address nat)) ;\n                   DIG 2 ;\n                   DUP ;\n                   CDR ;\n                   SWAP ;\n                   CAR ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   CDR ;\n                   SWAP ;\n                   GET ;\n                   IF_NONE\n                     { SWAP ; DROP ; SWAP ; DROP ; PUSH string \\"Dex/function-not-set\\" ; FAILWITH }\n                     { DIG 3 ; DIG 2 ; DUP ; DUG 3 ; CDR ; CAR ; DIG 4 ; PAIR ; PAIR ; EXEC } ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   CDR ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   PAIR ;\n                   DIG 2 ;\n                   CAR ;\n                   PAIR ;\n                   SWAP ;\n                   CAR ;\n                   PAIR }\n                 { DROP 2 ;\n                   DUP ;\n                   CAR ;\n                   CAR ;\n                   PUSH nat 8 ;\n                   GET ;\n                   IF_NONE\n                     { PUSH string \\"Dex/function-not-set\\" ; FAILWITH }\n                     { SELF ;\n                       ADDRESS ;\n                       DIG 2 ;\n                       DUP ;\n                       DUG 3 ;\n                       CDR ;\n                       CAR ;\n                       PUSH nat 0 ;\n                       RIGHT (pair (pair nat nat) nat) ;\n                       LEFT (or nat (pair nat address)) ;\n                       LEFT (or (or (pair (pair nat nat) address) (pair nat address))\n                                (or (pair (pair key_hash nat) address) address)) ;\n                       PAIR ;\n                       PAIR ;\n                       EXEC } ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   CDR ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   PAIR ;\n                   DIG 2 ;\n                   CAR ;\n                   PAIR ;\n                   SWAP ;\n                   CAR ;\n                   PAIR } }\n             { IF_LEFT\n                 { DIG 2 ;\n                   PUSH nat 3 ;\n                   PAIR ;\n                   DUG 2 ;\n                   RIGHT (pair address nat) ;\n                   LEFT (or (pair address (contract nat)) (pair unit (contract nat))) ;\n                   LEFT (pair address (pair address nat)) ;\n                   DIG 2 ;\n                   DUP ;\n                   CDR ;\n                   SWAP ;\n                   CAR ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   CDR ;\n                   SWAP ;\n                   GET ;\n                   IF_NONE\n                     { SWAP ; DROP ; SWAP ; DROP ; PUSH string \\"Dex/function-not-set\\" ; FAILWITH }\n                     { DIG 3 ; DIG 2 ; DUP ; DUG 3 ; CDR ; CAR ; DIG 4 ; PAIR ; PAIR ; EXEC } ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   CDR ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   PAIR ;\n                   DIG 2 ;\n                   CAR ;\n                   PAIR ;\n                   SWAP ;\n                   CAR ;\n                   PAIR }\n                 { DIG 2 ;\n                   PUSH nat 2 ;\n                   PAIR ;\n                   DUG 2 ;\n                   LEFT (pair unit (contract nat)) ;\n                   RIGHT (or (pair address nat)\n                             (pair (pair address address) (contract nat))) ;\n                   LEFT (pair address (pair address nat)) ;\n                   DIG 2 ;\n                   DUP ;\n                   CDR ;\n                   SWAP ;\n                   CAR ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   CDR ;\n                   SWAP ;\n                   GET ;\n                   IF_NONE\n                     { SWAP ; DROP ; SWAP ; DROP ; PUSH string \\"Dex/function-not-set\\" ; FAILWITH }\n                     { DIG 3 ; DIG 2 ; DUP ; DUG 3 ; CDR ; CAR ; DIG 4 ; PAIR ; PAIR ; EXEC } ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   CDR ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   PAIR ;\n                   DIG 2 ;\n                   CAR ;\n                   PAIR ;\n                   SWAP ;\n                   CAR ;\n                   PAIR } } }\n         { IF_LEFT\n             { IF_LEFT\n                 { SWAP ;\n                   DROP ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   NIL operation ;\n                   DIG 2 ;\n                   PUSH mutez 0 ;\n                   DIG 4 ;\n                   DUP ;\n                   DUG 5 ;\n                   CDR ;\n                   CAR ;\n                   CAR ;\n                   CDR ;\n                   CDR ;\n                   CAR ;\n                   CDR ;\n                   DIG 5 ;\n                   CDR ;\n                   CAR ;\n                   CAR ;\n                   CDR ;\n                   CAR ;\n                   CDR ;\n                   CDR ;\n                   PAIR ;\n                   TRANSFER_TOKENS ;\n                   CONS ;\n                   PAIR }\n                 { DIG 2 ;\n                   PUSH nat 4 ;\n                   PAIR ;\n                   DUG 2 ;\n                   RIGHT (pair address (contract nat)) ;\n                   RIGHT (or (pair address nat)\n                             (pair (pair address address) (contract nat))) ;\n                   LEFT (pair address (pair address nat)) ;\n                   DIG 2 ;\n                   DUP ;\n                   CDR ;\n                   SWAP ;\n                   CAR ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   CDR ;\n                   SWAP ;\n                   GET ;\n                   IF_NONE\n                     { SWAP ; DROP ; SWAP ; DROP ; PUSH string \\"Dex/function-not-set\\" ; FAILWITH }\n                     { DIG 3 ; DIG 2 ; DUP ; DUG 3 ; CDR ; CAR ; DIG 4 ; PAIR ; PAIR ; EXEC } ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   CDR ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   PAIR ;\n                   DIG 2 ;\n                   CAR ;\n                   PAIR ;\n                   SWAP ;\n                   CAR ;\n                   PAIR } }\n             { IF_LEFT\n                 { DIG 2 ;\n                   PUSH nat 0 ;\n                   PAIR ;\n                   DUG 2 ;\n                   RIGHT (or\n                           (or (pair address nat)\n                               (pair (pair address address) (contract nat)))\n                           (or (pair address (contract nat)) (pair unit (contract nat)))) ;\n                   DIG 2 ;\n                   DUP ;\n                   CDR ;\n                   SWAP ;\n                   CAR ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   CDR ;\n                   SWAP ;\n                   GET ;\n                   IF_NONE\n                     { SWAP ; DROP ; SWAP ; DROP ; PUSH string \\"Dex/function-not-set\\" ; FAILWITH }\n                     { DIG 3 ; DIG 2 ; DUP ; DUG 3 ; CDR ; CAR ; DIG 4 ; PAIR ; PAIR ; EXEC } ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   CDR ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   PAIR ;\n                   DIG 2 ;\n                   CAR ;\n                   PAIR ;\n                   SWAP ;\n                   CAR ;\n                   PAIR }\n                 { DIG 2 ;\n                   DUP ;\n                   DUG 3 ;\n                   CAR ;\n                   CAR ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   IF_LEFT\n                     { IF_LEFT\n                         { IF_LEFT { DROP ; PUSH nat 5 } { DROP ; PUSH nat 0 } }\n                         { IF_LEFT { DROP ; PUSH nat 4 } { DROP ; PUSH nat 1 } } }\n                     { IF_LEFT\n                         { IF_LEFT { DROP ; PUSH nat 2 } { DROP ; PUSH nat 7 } }\n                         { IF_LEFT { DROP ; PUSH nat 6 } { DROP ; PUSH nat 3 } } } ;\n                   GET ;\n                   IF_NONE\n                     { DROP 2 ; PUSH string \\"Dex/function-not-set\\" ; FAILWITH }\n                     { DIG 2 ; DIG 3 ; DUP ; DUG 4 ; CDR ; CAR ; DIG 3 ; PAIR ; PAIR ; EXEC } ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   CDR ;\n                   SWAP ;\n                   DUP ;\n                   DUG 2 ;\n                   CDR ;\n                   PAIR ;\n                   DIG 2 ;\n                   CAR ;\n                   PAIR ;\n                   SWAP ;\n                   CAR ;\n                   PAIR } } } }',
    // code: 'parameter unit;\nstorage unit;\ncode { CAR;\n       NIL operation;\n       PAIR }',
    parameter: 'Unit', storage: 'Unit'
  },
  {
    hash: 'KT1Fd2SXtKhCp4NnNuvuWkPxvKxMXjmKSYHF',
    code: 'parameter unit ;\nstorage string ;\ncode { DROP ;\n       PUSH string \"This is a smart contract!\" ;\n       NIL operation ;\n       PAIR }',
    storage: '"test"',
    parameter: 'Unit'
  },
  {
    hash: 'KT1UGh3NcJMeepkViyWeGMjCA2ujMDADQ8xp',
    code: 'parameter string;\nstorage string;\ncode { DUP; CAR; SWAP; CDR; CONCAT; NIL operation; PAIR }',
    storage: '"Hello from "',
    parameter: '"TezEdge"'
  },
  {
    hash: 'KT1FGbXAJTAT8wsJz6sTmDLwuRwSbGuJioMk',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { DROP;\n       SOURCE;\n       CONTRACT unit;\n       ASSERT_SOME;\n       PUSH mutez 300;\n       UNIT;\n       TRANSFER_TOKENS;\n       DIP { NIL operation };\n       CONS;\n       DIP { UNIT };\n       PAIR;\n       }'
  },
  {
    hash: 'tz1PduckPhxtmsuGV1VbgbqgBo3reAqzbsc3',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { CDR; NIL operation; PAIR}'
  },
  {
    hash: 'tz1VYcWWnA5gAc7hVacD34F3443jmhMTDzg',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { CAR; NIL operation; PAIR }'
  },
  {
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit ;\nstorage unit ;\ncode { CAR ;\n       PUSH int 3 ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       DROP ;\n       PUSH int 3 ;\n       IFCMPEQ { DROP } { DROP } ;\n       UNIT;\n       NIL operation ;\n       PAIR }'
  },
  {
    hash: 'tz1UXsFZ4ZexmdEGobShY8jKF7tcf4xCeXok',
    code: 'parameter (or (map %setMap string int) (set %setSet string));\nstorage (pair (map %keyMap string int) (set %keySet string));\ncode { UNPAIR ;\n       IF_LEFT { SWAP ; CDR ; SWAP ; PAIR } { SWAP ; CAR ; PAIR } ;\n       NIL operation ;\n       PAIR }',
    storage: '(Pair { Elt \"hello\" -0;  Elt \"hello2\" -0} { \"hello\";  \"hello2\"})',
    parameter: '"TezEdge"'
  },
  {
    hash: 'tz1ASxhdMEcAdzgRFMzR5TMPRexZC95sMXXa3',
    code: 'parameter (or (map %setMap key_hash int) (set %setSet key_hash)) ;\nstorage (pair (map %keyMap key_hash int) (set %keySet key_hash)) ;\ncode { UNPAIR ;\n       IF_LEFT { SWAP ; CDR ; SWAP ; PAIR } { SWAP ; CAR ; PAIR } ;\n       NIL operation ;\n       PAIR }',
    storage: '(Pair { Elt "tz1MSetqa3qdt3W7NTiqnrF8NY6ZhAPo5DAd" -0} { "tz1MSetqa3qdt3W7NTiqnrF8NY6ZhAPo5DAd" })',
    parameter: 'Right { "tz1MSetqa3qdt3W7NTiqnrF8NY6ZhAPo5DAd" }'
  },
  {
    hash: 'tz1MMkUljf292eacDSPTWXywujm45NuJJshS',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { CAR;\n       NIL operation;\n       PAIR }'
  },
  {
    hash: 'tz1VFEW92djf292eacDSPTWXywujmASC382d',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit ;\nstorage unit ;\ncode { CAR ;\n       PUSH int 3 ;\n       PUSH int 3 ;\n       IFCMPEQ { DROP } { DROP } ;\n       UNIT;\n       NIL operation ;\n       PAIR }'
  },
  {
    hash: 'tz1cxNunA5gAc7hVacDSPTWXywujmhMWEd81',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { DROP;\n       SOURCE;\n       CONTRACT unit;\n       ASSERT_SOME;\n       PUSH mutez 300;\n       UNIT;\n       TRANSFER_TOKENS;\n       DIP { NIL operation };\n       CONS;\n       DIP { UNIT };\n       PAIR;\n       }'
  },
  {
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { CDR; NIL operation; PAIR }'
  },
  {
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { CAR;\n       NIL operation;\n       PAIR }'
  },
  {
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJe',
    storage: 'Pair (Pair { Pair (Pair \"kepler://zCT5htke43MjKGP7hwY1rpTLjfvXZMiamXRx45QnGQc36HoaEBAs/zb38S8iCDyGG4fKH6Yw7Hwipn7gXaoZWMRkmMgVAtQZDBFLej\" 0x2fb9dfa0eb302c1f7be2f74ec727e141a144fb3d4f5e47871d9e2585a4e862e8) \"VerifiableCredential\"; Pair (Pair \"kepler://zCT5htke43MjKGP7hwY1rpTLjfvXZMiamXRx45QnGQc36HoaEBAs/zb38SDRpkZYFZYcccaMmhoQjFVkB8An8hYPnDaHJamUdC3uig\" 0x7e6581d2675c580192d84a8be8032c562c4724cabf39cd901020c7bf2c163f4e) \"VerifiableCredential\"; Pair (Pair \"kepler://zCT5htke43MjKGP7hwY1rpTLjfvXZMiamXRx45QnGQc36HoaEBAs/zb38SDuT7PeNu1LpzbcAh4g1p7tLPz2jjG3HYMaMvGNjdEdWu\" 0x97dd54a4678477276ec654259287a34e572b327a19973cfd5a5044a98987ca2c) \"VerifiableCredential\"; Pair (Pair \"kepler://zCT5htke43MjKGP7hwY1rpTLjfvXZMiamXRx45QnGQc36HoaEBAs/zb38SHtVkmgZsLM1Gaq3T7JcADxvs8jCoDrnat3jS2Z8GS18L\" 0x13df04f64e25893659a601e52c7f9c34da7d1df4fa347b264a8c94e221f89317) \"VerifiableCredential\" } \"tzprofiles\") (Pair {} \"tz1QdAAAkvDLRYRF8r3SzbS5hEoR4qZ1syPC\")',
    parameter: 'Pair { Pair (Pair "hello" 0xdeadc0de) "hello"; Pair (Pair "hello" 0xdeadc0de) "hello"} True',
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
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { DROP;\n       SOURCE;\n       CONTRACT unit;\n       ASSERT_SOME;\n       PUSH mutez 300;\n       UNIT;\n       TRANSFER_TOKENS;\n       DIP { NIL operation };\n       CONS;\n       DIP { UNIT };\n       PAIR;\n       }'
  },
  {
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { CDR; NIL operation; PAIR }'
  },
  {
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { CAR;\n       NIL operation;\n       PAIR }'
  },
  {
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit ;\nstorage unit ;\ncode { CAR ;\n       PUSH int 3 ;\n       PUSH int 3 ;\n       IFCMPEQ { DROP } { DROP } ;\n       UNIT;\n       NIL operation ;\n       PAIR }'
  },
  {
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { DROP;\n       SOURCE;\n       CONTRACT unit;\n       ASSERT_SOME;\n       PUSH mutez 300;\n       UNIT;\n       TRANSFER_TOKENS;\n       DIP { NIL operation };\n       CONS;\n       DIP { UNIT };\n       PAIR;\n       }'
  },
  {
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { CDR; NIL operation; PAIR }'
  },
  {
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { CAR;\n       NIL operation;\n       PAIR }'
  },
  {
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit ;\nstorage unit ;\ncode { CAR ;\n       PUSH int 3 ;\n       PUSH int 3 ;\n       IFCMPEQ { DROP } { DROP } ;\n       UNIT;\n       NIL operation ;\n       PAIR }'
  },
  {
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { DROP;\n       SOURCE;\n       CONTRACT unit;\n       ASSERT_SOME;\n       PUSH mutez 300;\n       UNIT;\n       TRANSFER_TOKENS;\n       DIP { NIL operation };\n       CONS;\n       DIP { UNIT };\n       PAIR;\n       }'
  },
  {
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { CDR; NIL operation; PAIR }'
  },
  {
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { CAR;\n       NIL operation;\n       PAIR }'
  },
  {
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit ;\nstorage unit ;\ncode { CAR ;\n       PUSH int 3 ;\n       PUSH int 3 ;\n       IFCMPEQ { DROP } { DROP } ;\n       UNIT;\n       NIL operation ;\n       PAIR }'
  },
  {
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { DROP;\n       SOURCE;\n       CONTRACT unit;\n       ASSERT_SOME;\n       PUSH mutez 300;\n       UNIT;\n       TRANSFER_TOKENS;\n       DIP { NIL operation };\n       CONS;\n       DIP { UNIT };\n       PAIR;\n       }'
  },
  {
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { CDR; NIL operation; PAIR }'
  },
  {
    hash: 'tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { CAR;\n       NIL operation;\n       PAIR }'
  },
  {
    hash: 'LLojLSWEFWJfeuluGWR8ulgwrfejEfew9FJEle',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit ;\nstorage unit ;\ncode { CAR ;\n       PUSH int 3 ;\n       PUSH int 3 ;\n       IFCMPEQ { DROP } { DROP } ;\n       UNIT;\n       NIL operation ;\n       PAIR }'
  },
  {
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { DROP;\n       SOURCE;\n       CONTRACT unit;\n       ASSERT_SOME;\n       PUSH mutez 300;\n       UNIT;\n       TRANSFER_TOKENS;\n       DIP { NIL operation };\n       CONS;\n       DIP { UNIT };\n       PAIR;\n       }'
  },
  {
    hash: 'KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG',
    parameter: 'Unit', storage: 'Unit',
    code: 'parameter unit;\nstorage unit;\ncode { CDR; NIL operation; PAIR }'
  },
];
