import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom, catchError, tap, filter, takeUntil } from 'rxjs/operators';
import { of, Subject, empty, timer } from 'rxjs';

const networkActionDestroy$ = new Subject();

@Injectable()
export class NetworkActionEffects {

  @Effect()
  NetworkActionLoad$ = this.actions$.pipe(
    ofType('NETWORK_ACTION_LOAD'),

    // merge state
    withLatestFrom(this.store, (action: any, state) => ({ action, state })),

    switchMap(({ action, state }) => {
      return this.http.get(
        state.settingsNode.api.debugger +
        '/v2/p2p/?' +
        networkActionFilter(action, state) +
        networkActionCursor(action, state)
      );
    }),

    // dispatch action
    map((payload) => ({ type: 'NETWORK_ACTION_LOAD_SUCCESS', payload: payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'NETWORK_ACTION_LOAD_ERROR',
        payload: error
      });
      return caught;
    })
  );

  // load network actions
  @Effect()
  NetworkActionStartEffect$ = this.actions$.pipe(
    ofType('NETWORK_ACTION_START'),

    // merge state
    withLatestFrom(this.store, (action: any, state) => ({ action, state })),

    switchMap(({ action, state }) =>

      // get header data every second
      timer(0, 1000).pipe(
        takeUntil(networkActionDestroy$),
        switchMap(() =>
          this.http.get(
            state.settingsNode.api.debugger + '/v2/p2p/?' +
            networkActionFilter(action, state) +
            networkActionCursor(action, state)
          ).pipe(
            map(response => ({ type: 'NETWORK_ACTION_START_SUCCESS', payload: response })),
            catchError(error => of({ type: 'NETWORK_ACTION_START_ERROR', payload: error }))
          )
        )
      )
    )
  );

  // stop network action download
  @Effect({ dispatch: false })
  NetworkActionStopEffect$ = this.actions$.pipe(
    ofType('NETWORK_ACTION_STOP'),
    // merge state
    withLatestFrom(this.store, (action: any, state) => ({ action, state })),
    // init app modules
    tap(({ action, state }) => {
      // console.log('[LOGS_ACTION_STOP] stream', state.logsAction.stream);
      // close all open observables
      // if (state.logsAction.stream) {
      networkActionDestroy$.next();
      // }
    })
  );

  @Effect()
  NetworkActionFilter$ = this.actions$.pipe(
    ofType('NETWORK_ACTION_FILTER'),

    // merge state
    withLatestFrom(this.store, (action: any, state) => ({ action, state })),

    tap(response => {
      networkActionDestroy$.next();
      networkActionFilter(response.action, response.state);
    }),

    // dispatch action
    map((payload) => ({ type: 'NETWORK_ACTION_START', payload: payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'NETWORK_ACTION_FILTER_ERROR',
        payload: error
      });
      return caught;
    })
  );

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private store: Store<any>
  ) {
  }

}

// filter network action
export function networkActionFilter(action, state) {

  // add type filterType
  let filterType = '';
  const stateFilter = state.networkAction.filter;

  filterType = stateFilter.meta ? filterType + 'metadata,' : filterType;
  filterType = stateFilter.connection ? filterType + 'connection_message,' : filterType;
  filterType = stateFilter.bootstrap ? filterType + 'bootstrap,' : filterType;
  filterType = stateFilter.advertise ? filterType + 'advertise,' : filterType;
  filterType = stateFilter.swap ? filterType + 'swap_request,swap_ack,' : filterType;
  filterType = stateFilter.deactivate ? filterType + 'deactivate,' : filterType;

  filterType = stateFilter.protocol ? filterType + 'get_protocols,protocol,' : filterType;
  filterType = stateFilter.operation ? filterType + 'get_operations,operation,' : filterType;
  filterType = stateFilter.currentHead ? filterType + 'get_current_head,current_head,' : filterType;
  filterType = stateFilter.currentBranch ? filterType + 'get_current_branch,current_branch,' : filterType;
  filterType = stateFilter.blockHeaders ? filterType + 'get_block_header,block_header,' : filterType;
  filterType = stateFilter.blockOperations ? filterType + 'get_operations_for_blocks,operations_for_blocks,' : filterType;
  filterType = stateFilter.blockOperationsHashes ?
    filterType + 'get_operation_hashes_for_blocks,operation_hashes_for_block,' : filterType;

  // replace last , with &
  filterType = filterType.length > 0 ? 'types=' + filterType.slice(0, -1) + '&' : '';

  // add filter for source
  let filterIncoming = '';
  filterIncoming = stateFilter.local && !stateFilter.remote ?
    'source_type=local&' : (!stateFilter.local && stateFilter.remote ? 'source_type=remote&' : '');

  // add remote_addr filter
  const filterRemoteAddr = state.networkAction.urlParams ? 'remote_addr=' + state.networkAction.urlParams + '&' : '';

  // console.log("[networkActionFilter] url ",
  //  state.settingsNode.api.debugger + '/v2/p2p/?' + filterType + filterIncoming + filterRemoteAddr + 'limit=10');

  return filterType + filterIncoming + filterRemoteAddr;

}

// use cursor to load previous pages
export function networkActionCursor(action, state) {

  const cursor = action.payload && action.payload.cursor_id && state.networkAction.ids.length > 0 ?
    'cursor_id=' + action.payload.cursor_id + '&' : '';

  return cursor + 'limit=100';

}
