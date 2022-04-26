import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { snakeCaseToCamelCase } from '@helpers/object.helper';
import { map } from 'rxjs/operators';
import { StateResourcesAction } from '@shared/types/resources/state/state-resources-action.type';
import { NANOSECOND_FACTOR } from '@shared/constants/unit-measurements';
import { StateResourcesActionGroup } from '@shared/types/resources/state/state-resources-action-group.type';
import { StateResourcesBlockData } from '@shared/types/resources/state/state-resources-block-data.type';

@Injectable({ providedIn: 'root' })
export class StateResourcesService {

  constructor(private http: HttpClient) { }

  getNodeLifetimeStateResources(api: string): Observable<StateResourcesActionGroup[]> {
    return this.http.get<StateResourcesActionGroup[]>(`${api}/dev/shell/automaton/actions_stats`).pipe(
      map(snakeCaseToCamelCase),
      map(res => this.mapStateResources(res))
    );
  }

  getBlockStateResources(api: string, level: number): Observable<StateResourcesBlockData[]> {
    const levels = this.getNeighbourLevels(level);
    return this.http.get<StateResourcesBlockData[]>(`${api}/dev/shell/automaton/actions_stats_for_blocks?level=${levels}`).pipe(
      map(snakeCaseToCamelCase),
      map(res => this.mapBlocksStateResources(res))
    );
  }

  private mapBlocksStateResources(response: any[]): StateResourcesBlockData[] {
    return response.reverse().map(r => ({
      time: r.time,
      blockLevel: r.blockLevel,
      blockHash: r.blockHash,
      blockFitness: r.blockFitness,
      blockRound: r.blockRound,
      cpuIdle: r.cpuIdle,
      cpuBusy: r.cpuBusy,
      groups: this.mapStateResources(r.stats)
    }));
  }

  private mapStateResources(response: any): StateResourcesActionGroup[] {
    this.convertTimesToSeconds(response);

    const groupNames = this.getGroupNames(response);

    return groupNames
      .map((groupName: string) => {
        const actions: StateResourcesAction[] = Object
          .keys(response)
          .filter(actionName => actionName.startsWith(groupName))
          .map(actionName => {
            const columns = Object.keys(response[actionName]).map(range => ({
              count: response[actionName][range].totalCalls,
              totalTime: response[actionName][range].totalDuration,
              maxTime: response[actionName][range].maxDuration,
              meanTime: response[actionName][range].totalDuration / response[actionName][range].totalCalls || 0,
              squareCount: this.getSquareCount(response[actionName][range].totalCalls)
            }));
            return {
              actionName,
              count: columns.reduce((acc, curr) => acc + curr.count, 0),
              totalTime: columns.reduce((acc, curr) => acc + curr.totalTime, 0),
              meanTime: columns.reduce((acc, curr) => acc + curr.meanTime, 0),
              columns
            };
          });
        return {
          groupName,
          actions,
          count: actions.reduce((acc, curr) => acc + curr.count, 0),
          totalTime: actions.reduce((acc, curr) => acc + curr.totalTime, 0),
          meanTime: actions.reduce((acc, curr) => acc + curr.meanTime, 0)
        };
      });
  }

  private getGroupNames(response: any): string[] {
    const regex = /\W+|(?=[A-Z])|_/g;
    const firstTwoWords = Object.keys(response).map(name => {
      const endIdx = name.indexOf(name.split(regex)[2]);
      return name.substr(0, endIdx !== -1 ? endIdx : name.length);
    });
    return [...new Set(firstTwoWords)];
  }

  private getSquareCount(calls: number): number {
    let squareCount = 0;
    while (calls >= 1) {
      calls /= 10;
      squareCount++;
    }
    return Math.min(squareCount, 8);
  }

  private convertTimesToSeconds(response: any): void {
    Object.keys(response).forEach(key => {
      Object.keys(response[key]).forEach(timeKey => {
        response[key][timeKey].totalDuration /= NANOSECOND_FACTOR;
        response[key][timeKey].maxDuration /= NANOSECOND_FACTOR;
      });
    });
  }

  private getNeighbourLevels(level: number): string {
    return [
      level - 1,
      level,
      level + 1,
    ].join(',');
  }
}
