import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StateMachineDiagramBlock } from '@shared/types/state-machine/state-machine-diagram-block.type';
import { StateMachineAction } from '@shared/types/state-machine/state-machine-action.type';
import { StateMachineActionsFilter } from '@shared/types/state-machine/state-machine-actions-filter.type';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StateMachineService {

  constructor(private http: HttpClient) { }

  getStateMachineDiagram(): Observable<StateMachineDiagramBlock[]> {
    const url = 'http://prod.tezedge.com:18732/dev/shell/automaton/actions_graph';
    return this.http.get<StateMachineDiagramBlock[]>(url).pipe(map(actions => {
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
    return this.http.get<StateMachineAction[]>(url);
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
}

// const diagramStructure: StateMachineDiagramBlock[] = [
//   {
//     type: 'info',
//     actionName: 'P2P socket authenticate',
//     actionId: 1,
//     nextActions: [21, 221, 90],
//     status: 'completed',
//   },
//   {
//     type: 'info',
//     actionName: 'Attempt to write connection message',
//     actionId: 21,
//     nextActions: [22, 91],
//     status: 'completed',
//   },
//   {
//     type: 'info',
//     actionName: 'Waiting for a response connection message',
//     actionId: 22,
//     nextActions: [333, 92],
//     status: 'completed',
//   },
//   {
//     type: 'info',
//     actionName: 'Connection message received without having sent one attempt to read connection message',
//     actionId: 221,
//     nextActions: [222, 93],
//     status: 'completed',
//   },
//   {
//     type: 'info',
//     actionName: 'Attempt to respond',
//     actionId: 222,
//     nextActions: [333, 94],
//     status: 'completed',
//   },
//   {
//     type: 'info',
//     actionName: 'Connection messages exchanged successfully',
//     actionId: 333,
//     nextActions: [3, 95],
//     status: 'completed',
//   },
//   {
//     type: 'info',
//     actionName: 'Exchange metadata message',
//     actionId: 3,
//     nextActions: [4, 96],
//     status: 'active',
//   },
//   {
//     type: 'info',
//     actionName: 'Exchange ack message',
//     actionId: 4,
//     nextActions: [5, 97],
//     status: 'pending',
//   },
//   {
//     type: 'info',
//     actionName: 'Exchange metadata chunks',
//     actionId: 5,
//     nextActions: [6, 98],
//     status: 'pending',
//   },
//   {
//     type: 'info',
//     actionName: 'Authenticated connection',
//     actionId: 6,
//     nextActions: [7],
//     status: 'pending',
//   },
//   {
//     type: 'info',
//     actionName: 'Exchanging ack/nack chunks',
//     actionId: 7,
//     nextActions: [8],
//     status: 'pending',
//   },
//   {
//     type: 'info',
//     actionName: 'Connection accepted!',
//     actionId: 8,
//     nextActions: [],
//     status: 'pending',
//   },
//   {
//     type: 'error',
//     actionName: 'Unknown Error',
//     actionId: 90,
//     nextActions: [],
//     status: 'completed',
//   },
//   {
//     type: 'error',
//     actionName: 'P2p Error',
//     actionId: 91,
//     nextActions: [],
//     status: 'completed',
//   },
//   {
//     type: 'error',
//     actionName: 'HTTP Error',
//     actionId: 92,
//     nextActions: [],
//     status: 'completed',
//   },
//   {
//     type: 'error',
//     actionName: 'Service Failed',
//     actionId: 93,
//     nextActions: [],
//     status: 'completed',
//   },
//   {
//     type: 'error',
//     actionName: 'WS Error',
//     actionId: 94,
//     nextActions: [],
//     status: 'completed',
//   },
//   {
//     type: 'error',
//     actionName: 'Connection Error',
//     actionId: 95,
//     nextActions: [],
//     status: 'completed',
//   },
//   {
//     type: 'error',
//     actionName: 'Thrown Unknown Error',
//     actionId: 96,
//     nextActions: [],
//     status: 'completed',
//   },
//   {
//     type: 'error',
//     actionName: 'Blacklisted',
//     actionId: 97,
//     nextActions: [],
//     status: 'completed',
//   },
//   {
//     type: 'error',
//     actionName: 'Kernel Error',
//     actionId: 98,
//     nextActions: [],
//     status: 'completed',
//   },
// ];
//
// const proposals: StateMachineProposal[] = [
//   {
//     title: 'INITIATE_CONNECTION',
//     id: 1,
//     content: {
//       data: 'I am a payload',
//       payloadMetadata: { value: '1203912809', hex: 'BLx4CyvBEua81n10n1e0fifhf0' }
//     },
//   },
//   {
//     title: 'SUCCESSFUL_CONNECTION_MESSAGE_WRITE',
//     id: 2,
//     payload: {
//       data: 'I am information',
//       info2: 123,
//       info4: { info: { stats: 'Diagram successful' } }
//     },
//     stateId: 21,
//     timestamp: 1628841546132,
//   },
//   {
//     title: 'RECEIVE_CONNECTION_MESSAGE',
//     id: 3,
//     payload: {
//       data: 'I was measured by the debugger',
//       moreMetadata: { data: { data: { data: 'no info' } } }, time: 'Today'
//     },
//     stateId: 22,
//     timestamp: 1628841556634,
//   },
//   {
//     title: 'SUCCESSFUL_CONNECTION_MESSAGE_READ',
//     id: 4,
//     payload: { data: 'P2P data' },
//     stateId: 333,
//     timestamp: 1628841576326,
//   },
//   {
//     title: 'SUCCESSFUL_CONNECTION_MESSAGE_READ',
//     id: 5,
//     payload: { data: 'I am data from Kernel', kernel1: 'protocol1244', kernel2: 'thread 088899' },
//     stateId: 221,
//     timestamp: 1628841566753,
//   },
//   {
//     title: 'SUCCESSFUL_CONNECTION_MESSAGE_READ_THREAD6',
//     id: 6, payload: { data: 'I am data from Core6', kernel1: '123124', kernel2: 'thread 3515' },
//     stateId: 222,
//     timestamp: 1628841566753,
//   },
//   {
//     title: 'SUCCESSFUL_CONNECTION_MESSAGE_WRITE',
//     id: 7, payload: { data: 'I will write a connection message' },
//     stateId: 3,
//     timestamp: 1628841586754,
//   },
//   {
//     title: 'TRIGGER_METADATA_EXCHANGING',
//     id: 8, payload: {
//       data: 'I exchange metadata',
//       data2: {
//         data: { data: { data: 'no data' } }
//       },
//       time: 'Today',
//       event: 'Proposal',
//       id: 91118284,
//       key: 'p2p000c'
//     },
//     stateId: 4,
//     timestamp: 1628841593756,
//   },
//   {
//     title: 'START_EXCHANGING_METADATA_CHUNKS',
//     id: 9, payload: { data: 'I start now', values: '1 2 3 5 59 17 2' },
//     stateId: 5,
//     timestamp: 1628841613746,
//   },
//   {
//     title: 'FINISH_EXCHANGING_METADATA_CHUNKS',
//     id: 10, payload: { data: 'I finish now the metadata chunks' },
//     stateId: 6,
//     timestamp: 1628841626756,
//   },
//   {
//     title: 'START_EXCHANGING_ACK_NACK_CHUNKS',
//     id: 11, payload: { data: { ack: 'ack nack ack nack', nack: 'nack nack' } },
//     stateId: 7,
//     timestamp: 1628841636657,
//   },
//   {
//     title: 'FINISH_EXCHANGING_ACK_NACK_CHUNKS',
//     id: 12, payload: {
//       data: 'Finish ack nack ack nack',
//       stateThing: { data: 10019 },
//       integration: {
//         timestamp: 1628841654756,
//         stringTime: '10 Dec. 2021'
//       }
//     },
//     stateId: 8,
//     timestamp: 1628841654756,
//   },
//   {
//     title: 'EXIT_SUCCESSFULLY',
//     id: 13, payload: {
//       data: 'I accept the connection. I exit bye.',
//       metadata: {
//         data2: '...Exited!.',
//         timestamp: 211131313132
//       }
//     },
//     stateId: 97,
//     timestamp: 1628841794244,
//   },
//   {
//     title: 'CONNECTION_ACCEPTED',
//     id: 14, payload: {
//       data: 'I accept the connection. Now the state should look connected.',
//       metadata: {
//         data2: 'Exit.',
//         stateId: 98,
//         timestamp: 1628841694706
//       }
//     },
//     stateId: 98,
//     timestamp: 1628841694706,
//   }
// ];
