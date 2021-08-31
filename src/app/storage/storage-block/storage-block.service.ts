import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageBlockDetails } from '@shared/types/storage/storage-block/storage-block-details.type';
import { map } from 'rxjs/operators';
import { StorageBlockDetailsOperationContext } from '@shared/types/storage/storage-block/storage-block-details-operation-context.type';

@Injectable({
  providedIn: 'root'
})
export class StorageBlockService {

  constructor(private http: HttpClient) { }

  checkStorageBlockAvailableContexts(api: string, hash: string): Observable<string[]> {
    return this.http.get<string[]>(`${api}/stats/main/blocks/${hash}`)
      .pipe(map(response => this.mapCheckContexts(response)));
  }

  getStorageBlockContextDetails(api: string, hash: string, context: string): Observable<StorageBlockDetails> {
    return this.http.get<StorageBlockDetails>(`${api}/stats/main/blocks/${hash}`)
      .pipe(map(response => this.mapGetStorageBlockContextDetailsResponse(response, context)));
  }

  private mapGetStorageBlockContextDetailsResponse(response: any, context: string): StorageBlockDetails {
    const block: StorageBlockDetails = response;
    block.checkoutContextTime = response[context + 'CheckoutContextTime'];
    block.commitContextTime = response[context + 'CommitContextTime'];
    block.operationsContext.forEach((op: StorageBlockDetailsOperationContext, i: number) => {
      const operation = response.operationsContext[i];
      op.data.actionsCount = operation.data[context + 'Count'];
      op.data.maxTime = operation.data[context + 'MaxTime'];
      op.data.meanTime = operation.data[context + 'MeanTime'];
      op.data.totalTime = operation.data[context + 'TotalTime'];
      op.add = operation[context + 'Add'];
      op.addTree = operation[context + 'AddTree'];
      op.find = operation[context + 'Find'];
      op.findTree = operation[context + 'FindTree'];
      op.mem = operation[context + 'Mem'];
      op.memTree = operation[context + 'MemTree'];
      op.remove = operation[context + 'Remove'];
    });
    return block;
  }

  private mapCheckContexts(response: any): string[] {
    const contexts = [];
    if (!this.areAllEmpty('irmin', response)) {
      contexts.push('irmin');
    }
    if (!this.areAllEmpty('tezedge', response)) {
      contexts.push('tezedge');
    }
    return contexts;
  }

  private areAllEmpty(context, response): boolean {
    const operation = response.operationsContext[0];
    const values = [
      response[context + 'CheckoutContextTime'],
      response[context + 'CommitContextTime'],
      operation.data[context + 'Count'],
      operation.data[context + 'MaxTime'],
      operation.data[context + 'MeanTime'],
      operation.data[context + 'TotalTime'],
      operation[context + 'Add'],
      operation[context + 'AddTree'],
      operation[context + 'Find'],
      operation[context + 'FindTree'],
      operation[context + 'Mem'],
      operation[context + 'MemTree'],
      operation[context + 'Remove']
    ];

    return values.every(val => !val);
  }
}
