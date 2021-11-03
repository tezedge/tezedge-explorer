import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageResourcesStats } from '@shared/types/resources/storage/storage-resources-stats.type';
import { catchError, map } from 'rxjs/operators';
import { ResourceStorageQuery } from '@shared/types/resources/storage/storage-resource-operation.type';
import { ReplaceCharacterPipe } from '@shared/pipes/replace-character.pipe';

@Injectable({
  providedIn: 'root'
})
export class StorageResourcesService {

  constructor(private http: HttpClient,
              private replacePipe: ReplaceCharacterPipe) { }

  getStorageResources(api: string, { context, protocol }: { context: string, protocol: string }): Observable<StorageResourcesStats> {
    const params = { context_name: context };
    if (protocol) {
      params['protocol'] = protocol;
    }
    return this.http.get<StorageResourcesStats>(`${api}/stats/context`, { params })
      .pipe(
        map(response => this.mapStorageResourcesResponse(response)),
        catchError(err => throwError(err))
      );
  }

  checkStorageResourcesContext(api: string, contextName: string): Observable<StorageResourcesStats> {
    return this.http.get<StorageResourcesStats>(`${api}/stats/context`, { params: { context_name: contextName } });
  }

  private mapStorageResourcesResponse(response: any): StorageResourcesStats {
    const result: StorageResourcesStats = response;
    result.operationsContext.sort((o1, o2) => o2.totalTime - o1.totalTime);

    result.commitContext = this.buildTimeline(response.commitContext);
    result.checkoutContext = this.buildTimeline(response.checkoutContext);
    result.operationsContext.forEach((operation) => {
      operation.mem = this.buildTimeline(operation.mem);
      operation.memTree = this.buildTimeline(operation.memTree);
      operation.find = this.buildTimeline(operation.find);
      operation.findTree = this.buildTimeline(operation.findTree);
      operation.add = this.buildTimeline(operation.add);
      operation.addTree = this.buildTimeline(operation.addTree);
      operation.remove = this.buildTimeline(operation.remove);
    });

    result.totalContext = { totalTime: 0, queriesCount: 0, columns: [] };
    result.totalContext.totalTime = result.operationsContext.reduce((sum, current) => sum + current.totalTime, 0);
    result.totalContext.totalTime += result.checkoutContext.totalTime;
    result.totalContext.totalTime += result.commitContext.totalTime;
    result.totalContext.queriesCount = result.operationsContext.reduce((sum, current) => sum + current.queriesCount, 0);
    result.totalContext.queriesCount += result.checkoutContext.queriesCount;
    result.totalContext.queriesCount += result.commitContext.queriesCount;
    result.totalContext.totalTimeRead = result.operationsContext.reduce((sum, current) => sum + current.totalTimeRead, 0);
    result.totalContext.totalTimeWrite = result.operationsContext.reduce((sum, current) => sum + current.totalTimeWrite, 0);
    result.totalContext.columns = [result.commitContext, result.checkoutContext, ...result.operationsContext]
      .map(operation => ({
        count: operation.queriesCount,
        totalTime: operation.totalTime,
        maxTime: undefined,
        meanTime: undefined,
        squareCount: undefined
      }));

    result.contextSliceNames = ['commit', 'checkout', ...result.operationsContext.map(op => op.root)]
      .map(name => this.replacePipe.transform(name, '_', ' '));
    return result;
  }

  private buildTimeline(graphData: any): ResourceStorageQuery {
    const columns = [];

    Object
      .keys(graphData)
      .filter(key => key !== 'totalTime' && key !== 'queriesCount')
      .forEach((key: string, index: number) => {
        columns[index] = {
          ...graphData[key],
          squareCount: this.getSquareCount(graphData[key].totalTime)
        };
      });

    graphData.columns = columns;

    return {
      columns,
      totalTime: graphData.totalTime,
      queriesCount: graphData.queriesCount
    };
  }

  private getSquareCount(totalTimeInSeconds: number): number {
    const TEN_MICROSECONDS_FACTOR = 100000;
    let squareCount = 0;
    let timeInTenMicroseconds = totalTimeInSeconds * TEN_MICROSECONDS_FACTOR;
    while (timeInTenMicroseconds > 1) {
      timeInTenMicroseconds /= 10;
      squareCount++;
    }
    return Math.min(squareCount, 8);
  }
}
