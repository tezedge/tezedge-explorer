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
    return this.http.get<StateMachineDiagramBlock[]>(url).pipe(map(actions => {
      actions.forEach(action => {
        action.type = 'info';
        action.status = 'completed';
      });
      return actions.filter(action => action.nextActions.length > 0);
    }));
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
    const SEVERITY_COEFFICIENT = sorted[sorted.length - 1].totalDuration * 1.1; // biggest value + 10%
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

//
// const diagramStructure: StateMachineDiagramBlock[] = [
//   {
//     type: 'info',
//     actionKind: 'P2P socket authenticate',
//     actionId: 1,
//     nextActions: [21, 221, 90],
//     status: 'completed',
//   },
//   {
//     type: 'info',
//     actionKind: 'Attempt to write connection message',
//     actionId: 21,
//     nextActions: [22, 91],
//     status: 'completed',
//   },
//   {
//     type: 'info',
//     actionKind: 'Waiting for a response connection message',
//     actionId: 22,
//     nextActions: [333, 92],
//     status: 'completed',
//   },
//   {
//     type: 'info',
//     actionKind: 'Connection message received without having sent one attempt to read connection message',
//     actionId: 221,
//     nextActions: [222, 93],
//     status: 'completed',
//   },
//   {
//     type: 'info',
//     actionKind: 'Attempt to respond',
//     actionId: 222,
//     nextActions: [333, 94],
//     status: 'completed',
//   },
//   {
//     type: 'info',
//     actionKind: 'Connection messages exchanged successfully',
//     actionId: 333,
//     nextActions: [3, 95],
//     status: 'completed',
//   },
//   {
//     type: 'info',
//     actionKind: 'Exchange metadata message',
//     actionId: 3,
//     nextActions: [4, 96],
//     status: 'active',
//   },
//   {
//     type: 'info',
//     actionKind: 'Exchange ack message',
//     actionId: 4,
//     nextActions: [5, 97],
//     status: 'pending',
//   },
//   {
//     type: 'info',
//     actionKind: 'Exchange metadata chunks',
//     actionId: 5,
//     nextActions: [6, 98],
//     status: 'pending',
//   },
//   {
//     type: 'info',
//     actionKind: 'Authenticated connection',
//     actionId: 6,
//     nextActions: [7],
//     status: 'pending',
//   },
//   {
//     type: 'info',
//     actionKind: 'Exchanging ack/nack chunks',
//     actionId: 7,
//     nextActions: [8],
//     status: 'pending',
//   },
//   {
//     type: 'info',
//     actionKind: 'Connection accepted!',
//     actionId: 8,
//     nextActions: [],
//     status: 'pending',
//   },
//   {
//     type: 'error',
//     actionKind: 'Unknown Error',
//     actionId: 90,
//     nextActions: [],
//     status: 'completed',
//   },
//   {
//     type: 'error',
//     actionKind: 'P2p Error',
//     actionId: 91,
//     nextActions: [],
//     status: 'completed',
//   },
//   {
//     type: 'error',
//     actionKind: 'HTTP Error',
//     actionId: 92,
//     nextActions: [],
//     status: 'completed',
//   },
//   {
//     type: 'error',
//     actionKind: 'Service Failed',
//     actionId: 93,
//     nextActions: [],
//     status: 'completed',
//   },
//   {
//     type: 'error',
//     actionKind: 'WS Error',
//     actionId: 94,
//     nextActions: [],
//     status: 'completed',
//   },
//   {
//     type: 'error',
//     actionKind: 'Connection Error',
//     actionId: 95,
//     nextActions: [],
//     status: 'completed',
//   },
//   {
//     type: 'error',
//     actionKind: 'Thrown Unknown Error',
//     actionId: 96,
//     nextActions: [],
//     status: 'completed',
//   },
//   {
//     type: 'error',
//     actionKind: 'Blacklisted',
//     actionId: 97,
//     nextActions: [],
//     status: 'completed',
//   },
//   {
//     type: 'error',
//     actionKind: 'Kernel Error',
//     actionId: 98,
//     nextActions: [],
//     status: 'completed',
//   },
// ];
//
// const diagramStructure2: StateMachineDiagramBlock[] = [
//   {
//     actionId: 0,
//     actionKind: 'PeersDnsLookupInit',
//     nextActions: [
//       1
//     ]
//   },
//   {
//     actionId: 1,
//     actionKind: 'PeersDnsLookupSuccess',
//     nextActions: [
//       2
//     ]
//   },
//   {
//     actionId: 2,
//     actionKind: 'PeersAddMulti',
//     nextActions: [
//       3
//     ]
//   },
//   {
//     actionId: 3,
//     actionKind: 'PeerConnectionOutgoingRandomInit',
//     nextActions: [
//       6,
//       4
//     ]
//   },
//   {
//     actionId: 4,
//     actionKind: 'PeerConnectionOutgoingInit',
//     nextActions: [
//       5
//     ]
//   },
//   {
//     actionId: 5,
//     actionKind: 'PeerConnectionOutgoingPending',
//     nextActions: [
//       3
//     ]
//   },
//   {
//     actionId: 6,
//     actionKind: 'PeersDnsLookupCleanup',
//     nextActions: [
//       7
//     ]
//   },
//   {
//     actionId: 7,
//     actionKind: 'P2pPeerEvent',
//     nextActions: [
//       8
//     ]
//   },
//   {
//     actionId: 8,
//     actionKind: 'PeerTryWrite',
//     nextActions: [
//       9,
//       16,
//       20
//     ]
//   },
//   {
//     actionId: 9,
//     actionKind: 'PeerConnectionOutgoingSuccess',
//     nextActions: [
//       10
//     ]
//   },
//   {
//     actionId: 10,
//     actionKind: 'PeerHandshakingInit',
//     nextActions: [
//       11
//     ]
//   },
//   {
//     actionId: 11,
//     actionKind: 'PeerHandshakingConnectionMessageInit',
//     nextActions: [
//       12
//     ]
//   },
//   {
//     actionId: 12,
//     actionKind: 'PeerHandshakingConnectionMessageEncode',
//     nextActions: [
//       13
//     ]
//   },
//   {
//     actionId: 13,
//     actionKind: 'PeerHandshakingConnectionMessageWrite',
//     nextActions: [
//       14
//     ]
//   },
//   {
//     actionId: 14,
//     actionKind: 'PeerChunkWriteSetContent',
//     nextActions: [
//       29,
//       15
//     ]
//   },
//   {
//     actionId: 15,
//     actionKind: 'PeerChunkWriteCreateChunk',
//     nextActions: [
//       8
//     ]
//   },
//   {
//     actionId: 16,
//     actionKind: 'PeerChunkWritePart',
//     nextActions: [
//       17
//     ]
//   },
//   {
//     actionId: 17,
//     actionKind: 'PeerChunkWriteReady',
//     nextActions: [
//       18,
//       30
//     ]
//   },
//   {
//     actionId: 18,
//     actionKind: 'PeerHandshakingConnectionMessageRead',
//     nextActions: [
//       19
//     ]
//   },
//   {
//     actionId: 19,
//     actionKind: 'PeerChunkReadInit',
//     nextActions: [
//       20
//     ]
//   },
//   {
//     actionId: 20,
//     actionKind: 'PeerTryRead',
//     nextActions: [
//       21,
//       7
//     ]
//   },
//   {
//     actionId: 21,
//     actionKind: 'PeerChunkReadPart',
//     nextActions: [
//       34,
//       20,
//       22
//     ]
//   },
//   {
//     actionId: 22,
//     actionKind: 'PeerChunkReadReady',
//     nextActions: [
//       35,
//       23
//     ]
//   },
//   {
//     actionId: 23,
//     actionKind: 'PeerHandshakingConnectionMessageDecode',
//     nextActions: [
//       24
//     ]
//   },
//   {
//     actionId: 24,
//     actionKind: 'PeerHandshakingEncryptionInit',
//     nextActions: [
//       25
//     ]
//   },
//   {
//     actionId: 25,
//     actionKind: 'PeerHandshakingMetadataMessageInit',
//     nextActions: [
//       26
//     ]
//   },
//   {
//     actionId: 26,
//     actionKind: 'PeerHandshakingMetadataMessageEncode',
//     nextActions: [
//       27
//     ]
//   },
//   {
//     actionId: 27,
//     actionKind: 'PeerHandshakingMetadataMessageWrite',
//     nextActions: [
//       28
//     ]
//   },
//   {
//     actionId: 28,
//     actionKind: 'PeerBinaryMessageWriteSetContent',
//     nextActions: [
//       14
//     ]
//   },
//   {
//     actionId: 29,
//     actionKind: 'PeerChunkWriteEncryptContent',
//     nextActions: [
//       15
//     ]
//   },
//   {
//     actionId: 30,
//     actionKind: 'PeerBinaryMessageWriteNextChunk',
//     nextActions: [
//       31
//     ]
//   },
//   {
//     actionId: 31,
//     actionKind: 'PeerBinaryMessageWriteReady',
//     nextActions: [
//       41,
//       32
//     ]
//   },
//   {
//     actionId: 32,
//     actionKind: 'PeerHandshakingMetadataMessageRead',
//     nextActions: [
//       33
//     ]
//   },
//   {
//     actionId: 33,
//     actionKind: 'PeerBinaryMessageReadInit',
//     nextActions: [
//       19
//     ]
//   },
//   {
//     actionId: 34,
//     actionKind: 'PeerChunkReadDecrypt',
//     nextActions: [
//       22
//     ]
//   },
//   {
//     actionId: 35,
//     actionKind: 'PeerBinaryMessageReadSizeReady',
//     nextActions: [
//       36
//     ]
//   },
//   {
//     actionId: 36,
//     actionKind: 'PeerBinaryMessageReadReady',
//     nextActions: [
//       37,
//       42
//     ]
//   },
//   {
//     actionId: 37,
//     actionKind: 'PeerHandshakingMetadataMessageDecode',
//     nextActions: [
//       38
//     ]
//   },
//   {
//     actionId: 38,
//     actionKind: 'PeerHandshakingAckMessageInit',
//     nextActions: [
//       39
//     ]
//   },
//   {
//     actionId: 39,
//     actionKind: 'PeerHandshakingAckMessageEncode',
//     nextActions: [
//       40
//     ]
//   },
//   {
//     actionId: 40,
//     actionKind: 'PeerHandshakingAckMessageWrite',
//     nextActions: [
//       28
//     ]
//   },
//   {
//     actionId: 41,
//     actionKind: 'PeerHandshakingAckMessageRead',
//     nextActions: [
//       33
//     ]
//   },
//   {
//     actionId: 42,
//     actionKind: 'PeerHandshakingAckMessageDecode',
//     nextActions: [
//       43
//     ]
//   },
//   {
//     actionId: 43,
//     actionKind: 'PeerHandshakingFinish',
//     nextActions: []
//   }
// ];
