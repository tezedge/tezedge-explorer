import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { StateMachineDiagramBlock } from '@shared/types/state-machine/state-machine-diagram-block.type';
import { StateMachineAction } from '@shared/types/state-machine/state-machine-action.type';
import { StateMachineActionsFilter } from '@shared/types/state-machine/state-machine-actions-filter.type';
import { map } from 'rxjs/operators';
import * as moment from 'moment-mini-ts';

// @ts-ignore
import * as serverData from './action-list.json';

@Injectable({
  providedIn: 'root'
})
export class StateMachineService {

  private data = serverData.default as any;

  constructor(private http: HttpClient) { }

  getStateMachineDiagram(): Observable<StateMachineDiagramBlock[]> {
    const url = 'http://prod.tezedge.com:18732/dev/shell/automaton/actions_graph';
    return this.http.get<StateMachineDiagramBlock[]>(url).pipe(map(actions => {
      // return of([...diagramStructure2]).pipe(map(actions => {
      actions.forEach(action => {
        action.type = 'info';
        action.status = 'completed';
        action.nextActions.sort((a, b) => a - b);
      });
      return actions;
    }));
  }

  getStateMachineActions(filter: StateMachineActionsFilter): Observable<StateMachineAction[]> {
    const url = 'http://prod.tezedge.com:18732/dev/shell/automaton/actions' + this.buildParams(filter);
    return this.http.get<StateMachineAction[]>(url)
      // return of(this.data)
      .pipe(map(this.addMockDateTime));
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
      + filters;
  }

  private addMockDateTime(actions: any[]): StateMachineAction[] {

    // add mock increasing timestamp
    // const date = new Date('2021-10-02T12:30:45.885').getTime() * 1000000 + Math.floor(Math.random() * 1000000);
    // const increasingCoefficients = actions
    //   .map(() => Math.floor(Math.random() * 100000000000) + 1)
    //   .sort((a, b) => b - a);
    // actions.forEach((action, i) => {
    //   // action.id = i;
    //   // action.timestamp = (date + increasingCoefficients[i]);
    // });

    // calculate difference
    actions.forEach((action, i) => {
      action.datetime = moment(Math.ceil(action.id / 1000000)).format('HH:mm:ss.SSS, DD MMM YY');

      if (actions[i - 1]) {
        action.timeDifference = actions[i - 1].id - action.id;
      } else {
        action.timeDifference = 0;
      }
    });
    return actions;
  }
}

const diagramStructure: StateMachineDiagramBlock[] = [
  {
    type: 'info',
    actionName: 'P2P socket authenticate',
    actionId: 1,
    nextActions: [21, 221, 90],
    status: 'completed',
  },
  {
    type: 'info',
    actionName: 'Attempt to write connection message',
    actionId: 21,
    nextActions: [22, 91],
    status: 'completed',
  },
  {
    type: 'info',
    actionName: 'Waiting for a response connection message',
    actionId: 22,
    nextActions: [333, 92],
    status: 'completed',
  },
  {
    type: 'info',
    actionName: 'Connection message received without having sent one attempt to read connection message',
    actionId: 221,
    nextActions: [222, 93],
    status: 'completed',
  },
  {
    type: 'info',
    actionName: 'Attempt to respond',
    actionId: 222,
    nextActions: [333, 94],
    status: 'completed',
  },
  {
    type: 'info',
    actionName: 'Connection messages exchanged successfully',
    actionId: 333,
    nextActions: [3, 95],
    status: 'completed',
  },
  {
    type: 'info',
    actionName: 'Exchange metadata message',
    actionId: 3,
    nextActions: [4, 96],
    status: 'active',
  },
  {
    type: 'info',
    actionName: 'Exchange ack message',
    actionId: 4,
    nextActions: [5, 97],
    status: 'pending',
  },
  {
    type: 'info',
    actionName: 'Exchange metadata chunks',
    actionId: 5,
    nextActions: [6, 98],
    status: 'pending',
  },
  {
    type: 'info',
    actionName: 'Authenticated connection',
    actionId: 6,
    nextActions: [7],
    status: 'pending',
  },
  {
    type: 'info',
    actionName: 'Exchanging ack/nack chunks',
    actionId: 7,
    nextActions: [8],
    status: 'pending',
  },
  {
    type: 'info',
    actionName: 'Connection accepted!',
    actionId: 8,
    nextActions: [],
    status: 'pending',
  },
  {
    type: 'error',
    actionName: 'Unknown Error',
    actionId: 90,
    nextActions: [],
    status: 'completed',
  },
  {
    type: 'error',
    actionName: 'P2p Error',
    actionId: 91,
    nextActions: [],
    status: 'completed',
  },
  {
    type: 'error',
    actionName: 'HTTP Error',
    actionId: 92,
    nextActions: [],
    status: 'completed',
  },
  {
    type: 'error',
    actionName: 'Service Failed',
    actionId: 93,
    nextActions: [],
    status: 'completed',
  },
  {
    type: 'error',
    actionName: 'WS Error',
    actionId: 94,
    nextActions: [],
    status: 'completed',
  },
  {
    type: 'error',
    actionName: 'Connection Error',
    actionId: 95,
    nextActions: [],
    status: 'completed',
  },
  {
    type: 'error',
    actionName: 'Thrown Unknown Error',
    actionId: 96,
    nextActions: [],
    status: 'completed',
  },
  {
    type: 'error',
    actionName: 'Blacklisted',
    actionId: 97,
    nextActions: [],
    status: 'completed',
  },
  {
    type: 'error',
    actionName: 'Kernel Error',
    actionId: 98,
    nextActions: [],
    status: 'completed',
  },
];

const diagramStructure2: StateMachineDiagramBlock[] = [
  {
    actionId: 0,
    actionName: 'PeersDnsLookupInit',
    nextActions: [
      1
    ]
  },
  {
    actionId: 1,
    actionName: 'PeersDnsLookupSuccess',
    nextActions: [
      2
    ]
  },
  {
    actionId: 2,
    actionName: 'PeersAddMulti',
    nextActions: [
      3
    ]
  },
  {
    actionId: 3,
    actionName: 'PeerConnectionOutgoingRandomInit',
    nextActions: [
      6,
      4
    ]
  },
  {
    actionId: 4,
    actionName: 'PeerConnectionOutgoingInit',
    nextActions: [
      5
    ]
  },
  {
    actionId: 5,
    actionName: 'PeerConnectionOutgoingPending',
    nextActions: [
      3
    ]
  },
  {
    actionId: 6,
    actionName: 'PeersDnsLookupCleanup',
    nextActions: [
      7
    ]
  },
  {
    actionId: 7,
    actionName: 'P2pPeerEvent',
    nextActions: [
      8
    ]
  },
  {
    actionId: 8,
    actionName: 'PeerTryWrite',
    nextActions: [
      9,
      16,
      20
    ]
  },
  {
    actionId: 9,
    actionName: 'PeerConnectionOutgoingSuccess',
    nextActions: [
      10
    ]
  },
  {
    actionId: 10,
    actionName: 'PeerHandshakingInit',
    nextActions: [
      11
    ]
  },
  {
    actionId: 11,
    actionName: 'PeerHandshakingConnectionMessageInit',
    nextActions: [
      12
    ]
  },
  {
    actionId: 12,
    actionName: 'PeerHandshakingConnectionMessageEncode',
    nextActions: [
      13
    ]
  },
  {
    actionId: 13,
    actionName: 'PeerHandshakingConnectionMessageWrite',
    nextActions: [
      14
    ]
  },
  {
    actionId: 14,
    actionName: 'PeerChunkWriteSetContent',
    nextActions: [
      29,
      15
    ]
  },
  {
    actionId: 15,
    actionName: 'PeerChunkWriteCreateChunk',
    nextActions: [
      8
    ]
  },
  {
    actionId: 16,
    actionName: 'PeerChunkWritePart',
    nextActions: [
      17
    ]
  },
  {
    actionId: 17,
    actionName: 'PeerChunkWriteReady',
    nextActions: [
      18,
      30
    ]
  },
  {
    actionId: 18,
    actionName: 'PeerHandshakingConnectionMessageRead',
    nextActions: [
      19
    ]
  },
  {
    actionId: 19,
    actionName: 'PeerChunkReadInit',
    nextActions: [
      20
    ]
  },
  {
    actionId: 20,
    actionName: 'PeerTryRead',
    nextActions: [
      21,
      7
    ]
  },
  {
    actionId: 21,
    actionName: 'PeerChunkReadPart',
    nextActions: [
      34,
      20,
      22
    ]
  },
  {
    actionId: 22,
    actionName: 'PeerChunkReadReady',
    nextActions: [
      35,
      23
    ]
  },
  {
    actionId: 23,
    actionName: 'PeerHandshakingConnectionMessageDecode',
    nextActions: [
      24
    ]
  },
  {
    actionId: 24,
    actionName: 'PeerHandshakingEncryptionInit',
    nextActions: [
      25
    ]
  },
  {
    actionId: 25,
    actionName: 'PeerHandshakingMetadataMessageInit',
    nextActions: [
      26
    ]
  },
  {
    actionId: 26,
    actionName: 'PeerHandshakingMetadataMessageEncode',
    nextActions: [
      27
    ]
  },
  {
    actionId: 27,
    actionName: 'PeerHandshakingMetadataMessageWrite',
    nextActions: [
      28
    ]
  },
  {
    actionId: 28,
    actionName: 'PeerBinaryMessageWriteSetContent',
    nextActions: [
      14
    ]
  },
  {
    actionId: 29,
    actionName: 'PeerChunkWriteEncryptContent',
    nextActions: [
      15
    ]
  },
  {
    actionId: 30,
    actionName: 'PeerBinaryMessageWriteNextChunk',
    nextActions: [
      31
    ]
  },
  {
    actionId: 31,
    actionName: 'PeerBinaryMessageWriteReady',
    nextActions: [
      41,
      32
    ]
  },
  {
    actionId: 32,
    actionName: 'PeerHandshakingMetadataMessageRead',
    nextActions: [
      33
    ]
  },
  {
    actionId: 33,
    actionName: 'PeerBinaryMessageReadInit',
    nextActions: [
      19
    ]
  },
  {
    actionId: 34,
    actionName: 'PeerChunkReadDecrypt',
    nextActions: [
      22
    ]
  },
  {
    actionId: 35,
    actionName: 'PeerBinaryMessageReadSizeReady',
    nextActions: [
      36
    ]
  },
  {
    actionId: 36,
    actionName: 'PeerBinaryMessageReadReady',
    nextActions: [
      37,
      42
    ]
  },
  {
    actionId: 37,
    actionName: 'PeerHandshakingMetadataMessageDecode',
    nextActions: [
      38
    ]
  },
  {
    actionId: 38,
    actionName: 'PeerHandshakingAckMessageInit',
    nextActions: [
      39
    ]
  },
  {
    actionId: 39,
    actionName: 'PeerHandshakingAckMessageEncode',
    nextActions: [
      40
    ]
  },
  {
    actionId: 40,
    actionName: 'PeerHandshakingAckMessageWrite',
    nextActions: [
      28
    ]
  },
  {
    actionId: 41,
    actionName: 'PeerHandshakingAckMessageRead',
    nextActions: [
      33
    ]
  },
  {
    actionId: 42,
    actionName: 'PeerHandshakingAckMessageDecode',
    nextActions: [
      43
    ]
  },
  {
    actionId: 43,
    actionName: 'PeerHandshakingFinish',
    nextActions: []
  }
];
