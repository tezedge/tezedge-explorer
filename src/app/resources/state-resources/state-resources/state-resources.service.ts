import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { snakeCaseToCamelCase } from '@helpers/object.helper';
import { map } from 'rxjs/operators';
import { StateResourcesAction } from '@shared/types/resources/state/state-resources-action.type';
import { NANOSECOND_FACTOR } from '@shared/constants/unit-measurements';
import { StateResourcesActionGroup } from '@shared/types/resources/state/state-resources-action-group.type';
import { StateResourcesBlockData } from '@shared/types/resources/state/state-resources-block-data.type';
import { StateResourcesActionDetails } from '@shared/types/resources/state/state-resources-action-details.type';

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
    const levels = (level - 1) + ',' + level + ',' + (level + 1);
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
    return Object.keys(groupNames)
      .map((groupName: string) => {
        const actions: StateResourcesAction[] = Object
          .keys(response)
          .filter(actionName => groupNames[groupName].includes(actionName))
          .map(actionName => {
            const columns: StateResourcesActionDetails[] = Object.keys(response[actionName]).map(range => ({
              count: response[actionName][range].totalCalls,
              totalTime: response[actionName][range].totalDuration,
              maxTime: response[actionName][range].maxDuration,
              squareCount: this.getSquareCount(response[actionName][range].totalCalls)
            }));
            return {
              actionName,
              count: columns.reduce((acc: number, curr: StateResourcesActionDetails) => acc + curr.count, 0),
              totalTime: columns.reduce((acc: number, curr: StateResourcesActionDetails) => acc + curr.totalTime, 0),
              columns
            };
          });
        const count = actions.reduce((acc: number, curr: StateResourcesAction) => acc + curr.count, 0);
        const totalTime = actions.reduce((acc: number, curr: StateResourcesAction) => acc + curr.totalTime, 0);
        return {
          groupName,
          actions,
          count,
          totalTime,
          meanTime: totalTime / count
        };
      });
  }

  private getGroupNames(stats: any): { [p: string]: string[] } {
    let finalGroups: { [p: string]: string[] };
    let usedActions: { [p: string]: boolean };
    const statsActionNames = Object.keys(stats);
    const prefixGroups: { [p: string]: string[] } = statsActionNames
      .reduce((groups: { [p: string]: string[] }, actionName: string) => {
        const nameSlices: string[] = actionName.split(/(?=[A-Z])/);
        nameSlices.reduce((sliceBuildup: string, slice: string) => {
          sliceBuildup = sliceBuildup + slice;
          groups[sliceBuildup] = groups[sliceBuildup] || [];
          groups[sliceBuildup].push(actionName);
          return sliceBuildup;
        }, '');
        return groups;
      }, {});
    const sortedGroups: [string, string[]][] = Object.entries(prefixGroups).sort((a, b) => b[0].length - a[0].length);
    [finalGroups, usedActions] = sortedGroups
      .filter(([groups, items]) => items.length > 1)
      .reduce((
        [groups, usedActionsParam]: [groups: { [p: string]: string[] }, usedActionsParam: { [p: string]: boolean }],
        [groupName, actions]: [groupName: string, actions: string[]]
      ) => {
        actions = actions.filter((actionName: string) => !usedActionsParam[actionName]);
        if (actions.length > 1) {
          groups[groupName] = actions;
          usedActionsParam = actions.reduce((r, actionName: string) => ({
            ...r,
            [actionName]: true
          }), usedActionsParam);
        }
        return [groups, usedActionsParam];
      }, [{}, {}]);
    const ungroupedActions = statsActionNames.filter((actionName: string) => !usedActions[actionName]);
    const ungrouped = ungroupedActions.reduce((ungroupedObject: { [p: string]: string[] }, name: string) => ({
      ...ungroupedObject,
      [name]: [name]
    }), {});
    return ({ ...finalGroups, ...ungrouped });
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
}
