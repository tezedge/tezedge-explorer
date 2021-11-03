import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StateMachineDiagramBlock } from '@shared/types/state-machine/state-machine-diagram-block.type';
import { StateMachineAction } from '@shared/types/state-machine/state-machine-action.type';
import { StateMachineActionsFilter } from '@shared/types/state-machine/state-machine-actions-filter.type';
import { map } from 'rxjs/operators';
import * as moment from 'moment-mini-ts';
import { formatNumber } from '@angular/common';
import { StateMachineActionKindStatistics } from '@shared/types/state-machine/state-machine-action-kind-statistics.type';
import { StateMachineActionStatistics } from '@shared/types/state-machine/state-machine-action-statistics.type';

const MILLISECOND_FACTOR = 1000;
const MICROSECOND_FACTOR = 1000000;
const NANOSECOND_FACTOR = 1000000000;

@Injectable({
  providedIn: 'root'
})
export class StateMachineService {

  constructor(private http: HttpClient) { }

  getStateMachineDiagram(http: string): Observable<StateMachineDiagramBlock[]> {
    const url = http + '/dev/shell/automaton/actions_graph';
    return this.http.get<StateMachineDiagramBlock[]>(url)
      .pipe(map(actions => actions.filter(action => action.nextActions.length > 0)));
  }

  getStateMachineActions(http: string, filter: StateMachineActionsFilter): Observable<StateMachineAction[]> {
    const url = http + '/dev/shell/automaton/actions' + this.buildParams(filter);
    return this.http.get<StateMachineAction[]>(url).pipe(map(this.calculateTimes));
  }

  getStateMachineActionStatistics(http: string): Observable<StateMachineActionStatistics> {
    const url = http + '/dev/shell/automaton/actions_stats';
    return this.http.get(url).pipe(map(this.mapActionStatistics));
  }

  private buildParams(filter: StateMachineActionsFilter): string {
    let filters = '';
    if (filter.queryFilters.length > 0) {
      filters = '&filters=';
      filter.queryFilters.forEach(f => filters += `${f},`);
      filters = filters.slice(0, -1);
    }

    return `?limit=${filter.limit}`
      + (filter.cursor ? `&cursor=${filter.cursor}` : '')
      + (filter.rev ? `&rev=1` : '')
      + filters;
  }

  private calculateTimes(actions: any[]): StateMachineAction[] {
    actions.forEach(action => {
      action.datetime = moment(Math.ceil(action.id / 1000000)).format('HH:mm:ss.SSS, DD MMM YY');
      action.duration = StateMachineService.transform(action.duration);
    });
    return actions;
  }

  private mapActionStatistics(statistics: any): StateMachineActionStatistics {
    const sorted = Object.keys(statistics).map(key => statistics[key]).sort((a, b) => a.totalDuration - b.totalDuration);
    const SEVERITY_COEFFICIENT = sorted[sorted.length - 1]?.totalDuration * 1.1; // biggest value + 10%
    const stats = Object
      .keys(statistics)
      .map(key => ({
        kind: key,
        duration: statistics[key].totalDuration / 1000000000,
        calls: statistics[key].totalCalls,
        durationWidth: Math.max(100 * statistics[key].totalDuration / SEVERITY_COEFFICIENT, 0.5)
      } as StateMachineActionKindStatistics))
      .sort((c1, c2) => c2.duration - c1.duration);

    return {
      statistics: stats,
      totalDuration: stats.reduce((sum, current) => sum + current.duration, 0),
      totalCalls: stats.reduce((sum, current) => sum + current.calls, 0),
    } as StateMachineActionStatistics;
  }

  private static transform(value: number): string {
    if (value > 1000000000) {
      return '<span class="text-red">' + this.format(value / NANOSECOND_FACTOR) + ' s</span>';
    } else if (value > 500000000) {
      return '<span class="text-red">' + this.format(value / MICROSECOND_FACTOR) + ' ms</span>';
    } else if (value > 1000000) {
      return '<span class="text-yellow">' + this.format(value / MICROSECOND_FACTOR) + ' ms</span>';
    } else if (value > 1) {
      return this.format(value / MILLISECOND_FACTOR) + ' μs';
    } else if (value) {
      return value.toString();
    }
  }

  private static format(value: number): string {
    return formatNumber(value, 'en-US', '1.0-2');
  }
}
