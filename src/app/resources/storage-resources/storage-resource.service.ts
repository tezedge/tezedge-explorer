import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageResourcesStats } from '../../shared/types/resources/storage/storage-resources-stats.type';
import { map } from 'rxjs/operators';
import { ResourceStorageQuery } from '../../shared/types/resources/storage/storage-resource-operation.type';
import { ReplaceCharacterPipe } from '../../shared/pipes/replace-character.pipe';

@Injectable({
  providedIn: 'root'
})
export class StorageResourceService {

  constructor(private http: HttpClient,
              private replacePipe: ReplaceCharacterPipe) { }

  getStorageResources(api: string, contextName: string): Observable<StorageResourcesStats> {
    return this.http.get<StorageResourcesStats>(`${api}/stats/context`, { params: { context_name: contextName } })
      .pipe(map(response => this.mapStorageResourcesResponse(response)));
  }

  private mapStorageResourcesResponse(response: any): StorageResourcesStats {
    const result: StorageResourcesStats = response;
    result.operationsContext.sort((o1, o2) => o2.totalTime - o1.totalTime);

    result.commitContext = this.buildTimeline(response.commitContext);
    result.checkoutContext = this.buildTimeline(response.checkoutContext);
    result.operationsContext.forEach((operation) => {
      operation.mem = this.buildTimeline(operation.mem);
      operation.find = this.buildTimeline(operation.find);
      operation.findTree = this.buildTimeline(operation.findTree);
      operation.add = this.buildTimeline(operation.add);
      operation.addTree = this.buildTimeline(operation.addTree);
      operation.remove = this.buildTimeline(operation.remove);
    });

    result.totalContext = { totalTime: 0, actionsCount: 0, columns: [] };
    result.totalContext.totalTime = result.operationsContext.reduce((sum, current) => sum + current.totalTime, 0);
    result.totalContext.totalTime += result.checkoutContext.totalTime;
    result.totalContext.totalTime += result.commitContext.totalTime;
    result.totalContext.actionsCount = result.operationsContext.reduce((sum, current) => sum + current.actionsCount, 0);
    result.totalContext.actionsCount += result.checkoutContext.actionsCount;
    result.totalContext.actionsCount += result.commitContext.actionsCount;
    result.totalContext.totalTimeRead = result.operationsContext.reduce((sum, current) => sum + current.totalTimeRead, 0);
    result.totalContext.totalTimeWrite = result.operationsContext.reduce((sum, current) => sum + current.totalTimeWrite, 0);
    result.totalContext.columns = [result.commitContext, result.checkoutContext, ...result.operationsContext]
      .map(operation => ({
        count: operation.actionsCount,
        totalTime: operation.totalTime,
        maxTime: undefined,
        meanTime: undefined,
        squareCount: this.getSquareCount(operation.totalTime, 100)
      }));

    result.contextSliceNames = ['commit', 'checkout', ...result.operationsContext.map(op => op.root)]
      .map(name => this.replacePipe.transform(name, '_', ' '));
    return result;
  }

  private buildTimeline(graphData: any): ResourceStorageQuery {
    const columns = [];

    Object
      .keys(graphData)
      .filter(key => key !== 'totalTime' && key !== 'actionsCount')
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
      actionsCount: graphData.actionsCount
    };
  }

  private getSquareCount(totalTimeInSeconds: number, step: number = 1): number {
    const TEN_MICROSECONDS_FACTOR = 100000 / step;
    let squareCount = 0;
    let timeInTenMicroseconds = totalTimeInSeconds * TEN_MICROSECONDS_FACTOR;
    while (timeInTenMicroseconds > 1) {
      timeInTenMicroseconds /= 10;
      squareCount++;
    }
    if (timeInTenMicroseconds > 0 && squareCount === 0) {
      squareCount = 1;
    }
    return Math.min(squareCount, 8);
  }
}
