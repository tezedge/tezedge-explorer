import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, of, switchMap } from 'rxjs';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import { catchError, map } from 'rxjs/operators';
import { emitMicheline, Parser } from '@taquito/michel-codec';
import { SmartContractResult } from '@shared/types/smart-contracts/smart-contract-result.type';
import { SmartContractTrace } from '@shared/types/smart-contracts/smart-contract-trace.type';
import { collectScriptElements } from '@smart-contracts/smart-contracts/smart-contracts.factory';
import { SmartContractDebugPoint } from '@shared/types/smart-contracts/smart-contract-debug-point.type';
import { jsonStringifySortedProperties } from '@helpers/json.helper';


@Injectable({
  providedIn: 'root'
})
export class SmartContractsService {

  private readonly parser: Parser = new Parser();

  constructor(private http: HttpClient) { }

  getContracts(api: string, hash: string): Observable<{ contracts: Partial<SmartContract>[], previousBlockHash: string }> {
    return this.http.get<any>(`${api}/chains/main/blocks/${hash}`).pipe(
      map((response) => this.mapGetContracts(response))
    );
  }

  getContractsDetails(api: string, contract: SmartContract, previousBlockHash: string): Observable<SmartContract> {
    return this.getContractCodeForTable(api, previousBlockHash, contract)
      .pipe(
        switchMap((fullContract: SmartContract) => this.addBalanceToContract(api, previousBlockHash, fullContract)),
        switchMap((fullContract: SmartContract) => this.addTraceDifferencesToContract(api, previousBlockHash, fullContract))
      );
  }

  private addTraceDifferencesToContract(api: string, previousBlockHash: string, contract: SmartContract) {
    const body = SmartContractsService.buildGetTraceRequestBody(contract);
    return this.http.post(`${api}/chains/main/blocks/${previousBlockHash}/helpers/scripts/trace_code`, body).pipe(
      map((traceCodeResponse: any) => {
        contract.isSameStorage =
          jsonStringifySortedProperties(contract.blockStorage, 0) === jsonStringifySortedProperties(traceCodeResponse.storage, 0);

        contract.isSameBigMaps =
          jsonStringifySortedProperties(contract.blockBigMaps, 0) === jsonStringifySortedProperties(traceCodeResponse.lazy_storage_diff, 0);

        return {
          traceStorage: traceCodeResponse.storage,
          traceBigMaps: traceCodeResponse.lazy_storage_diff,
          traceConsumedGas: SmartContractsService.getConsumedGasForResult(traceCodeResponse.trace),
          traceExecutionStatus: traceCodeResponse.trace ? 'Success' : ''
        };
      }),
      catchError(err => {
        if (!err.error) { return EMPTY; }
        return of({
          traceStorage: null,
          traceBigMaps: null,
          traceConsumedGas: SmartContractsService.getConsumedGasForResult(err.error.reduce((acc, curr) => [...acc, ...(curr?.trace || [])], [])),
          traceExecutionStatus: JSON.stringify(err.error[err.error.length - 1]?.with) || 'Failed'
        });
      }),
      map((traceResponse: { traceConsumedGas: number, traceExecutionStatus: string, traceStorage: object, traceBigMaps: object }) => ({
        ...contract,
        traceStorage: traceResponse.traceStorage,
        traceBigMaps: traceResponse.traceBigMaps,
        traceConsumedGas: traceResponse.traceConsumedGas,
        traceExecutionStatus: traceResponse.traceExecutionStatus
      }))
    );
  }

  private addBalanceToContract(api: string, previousBlockHash: string, contract: SmartContract): Observable<SmartContract> {
    return this.http.get(`${api}/chains/main/blocks/${previousBlockHash}/context/contracts/${contract.hash}/balance`).pipe(
      map((balance: string) => ({ ...contract, balance }))
    );
  }

  private mapGetContracts(response: any): { contracts: Partial<SmartContract>[], previousBlockHash: string } {
    const contracts: Partial<SmartContract>[] = [];
    response.operations[3].forEach(operation => {
      const blockContracts: any[] = operation.contents.filter(
        contract => contract.destination?.startsWith('KT1') && contract.kind === 'transaction'
      );
      blockContracts.forEach((contract, i: number) => {
        let indexes = [];
        for (let j = 0; j < blockContracts.length; j++) {
          if (blockContracts[j].destination === contract.destination) {
            indexes.push(j);
          }
        }
        indexes = indexes.filter(l => l < i);

        const storageObj = indexes.length > 0
          ? blockContracts[indexes[indexes.length - 1]].metadata.operation_result.storage
          : null;
        if (contracts.length <= 222) {
          contracts.push({
            hash: contract.destination,
            id: contracts.length,
            entrypoint: contract.parameters?.entrypoint,
            chainId: operation.chain_id,
            amount: contract.amount,
            gasLimit: contract.gas_limit,
            parameter: contract.parameters ? this.formatMichelsonCode(contract.parameters.value) : null,
            parameterObj: contract.parameters?.value,
            storageObj,
            storage: storageObj ? this.formatMichelsonCode(storageObj) : null,
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
    // get CODE OBJ and STORAGE OBJ - script RPC
    return this.http.get<{ code: object, storage: object }>(`${api}/chains/main/blocks/${blockHash}/context/contracts/${contract.hash}/script`)
      .pipe(
        map((script: { code: object, storage: object }) => ({
          codeObj: script.code,
          storageObj: contract.storageObj ?? script.storage,
          storage: this.formatMichelsonCode(contract.storageObj ?? script.storage),
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
    return this.http.get<{ code: object, storage: object }>(`${api}/chains/main/blocks/${blockHash}/context/contracts/${contract.hash}/script`)
      .pipe(
        map((script: { code: object, storage: object }) => ({
          code: this.formatMichelsonCode(script.code),
          codeObj: script.code,
          storageObj: contract.storageObj ?? script.storage,
          storage: this.formatMichelsonCode(contract.storageObj ?? script.storage),

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
    const body = SmartContractsService.buildGetTraceRequestBody(contract);
    return this.http.post<any>(`${api}/chains/main/blocks/${blockHash}/helpers/scripts/trace_code`, body).pipe(
      map((response) => this.mapNewGetContractTrace(response, contract)),
      catchError(err => of(this.mapNewGetContractTrace(err.error, contract)))
    );
  }

  private mapNewGetContractTrace(response: any, contract: SmartContract): { trace: SmartContractTrace[], gasTrace: number[], result: SmartContractResult } {
    let trace: SmartContractTrace[];
    let gasTrace: number[];
    const result: SmartContractResult = { executionInfo: response };
    const traceResponse = response.trace ?? response.reduce((acc, curr) => [...acc, ...(curr?.trace || [])], []);
    if (traceResponse.length > 0) {
      trace = this.getTrace(traceResponse, contract);
      result.consumedGas = SmartContractsService.getConsumedGasForResult(traceResponse);
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

  private static getConsumedGasForResult(trace: SmartContractTrace[]): number | undefined {
    return trace.length > 0 ? (Number('8000000000') * 1000) - Number(trace[trace.length - 1].gas) : undefined;
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

  private static buildGetTraceRequestBody(contract: SmartContract): any {
    return {
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
