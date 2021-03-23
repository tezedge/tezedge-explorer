import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom, catchError, tap, takeUntil } from 'rxjs/operators';
import { ObservedValueOf, of, Subject, timer } from 'rxjs';
import { State } from '../../app.reducers';

const networkActionDestroy$ = new Subject();

@Injectable()
export class NetworkActionEffects {

  @Effect()
  NetworkActionLoad$ = this.actions$.pipe(
    ofType('NETWORK_ACTION_LOAD'),

    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({action, state})),

    switchMap(({action, state}) => {
      this.limit = action.payload?.limit || 1000;
      return this.http.get(setUrl(action, state));
    }),

    map((payload) => ({type: 'NETWORK_ACTION_LOAD_SUCCESS', payload, limit: this.limit})),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'NETWORK_ACTION_LOAD_ERROR',
        payload: error
      });
      return caught;
    })
  );

  @Effect()
  NetworkActionFilter$ = this.actions$.pipe(
    ofType('NETWORK_ACTION_FILTER'),

    // merge state
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),

    tap(response => {
      networkActionDestroy$.next();
      networkActionFilter(response.action, response.state);
    }),

    // dispatch action
    map((payload) => ({ type: 'NETWORK_ACTION_LOAD', payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'NETWORK_ACTION_FILTER_ERROR',
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
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),

    switchMap(({ action, state }) =>
      // get header data every second
      timer(0, 2000).pipe(
        takeUntil(networkActionDestroy$),
        switchMap(() => {
            this.limit = action.payload?.limit || 1000;
            return this.http.get(setUrl(action, state)).pipe(
              map(response => ({type: 'NETWORK_ACTION_START_SUCCESS', payload: response, limit: this.limit})),
              catchError(error => of({type: 'NETWORK_ACTION_START_ERROR', payload: error}))
            );
          }
        )
      )
    )
  );

  // stop network action download
  @Effect({ dispatch: false })
  NetworkActionStopEffect$ = this.actions$.pipe(
    ofType('NETWORK_ACTION_STOP'),
    // merge state
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    // init app modules
    tap(({ action, state }) => {
      // console.log('[LOGS_ACTION_STOP] stream', state.logsAction.stream);
      // close all open observables
      // if (state.logsAction.stream) {
      networkActionDestroy$.next();
      // }
    })
  );

  private limit: any;

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private store: Store<any>
  ) {
  }

}

export function setUrl(action, state) {
  const url = `${state.settingsNode.debugger}/v2/p2p/?node_name=${state.settingsNode.activeNode.p2p_port}&`;
  const cursor = networkActionCursor(action);
  const filters = networkActionFilter(action, state);
  const limit = networkActionLimit(action);

  return `${url}${filters.length ? `${filters}&` : ''}${cursor.length ? `${cursor}&` : ''}${limit}`;
}

// use limit to load just the necessary number of records
export function networkActionLimit(action) {
  const limitNr = action.payload && action.payload.limit ?
    action.payload.limit :
    '1000';

  return `limit=${limitNr}`;
}

// use cursor to load previous pages
export function networkActionCursor(action) {
  return action.payload && action.payload.cursor_id ?
    `cursor_id=${action.payload.cursor_id}` :
    '';
}

// filter network action
export function networkActionFilter(action, state) {
  let filterType = '';

  if (state.networkAction && state.networkAction.filter) {
    const stateFilter = state.networkAction.filter;

    filterType = stateFilter.meta ? filterType + 'metadata,' : filterType;
    filterType = stateFilter.connection ? filterType + 'connection_message,' : filterType;
    filterType = stateFilter.acknowledge ? filterType + 'ack_message,' : filterType;
    filterType = stateFilter.bootstrap ? filterType + 'bootstrap,' : filterType;
    filterType = stateFilter.advertise ? filterType + 'advertise,' : filterType;
    filterType = stateFilter.swap ? filterType + 'swap_request,swap_ack,' : filterType;
    filterType = stateFilter.deactivate ? filterType + 'deactivate,' : filterType;

    filterType = stateFilter.protocol ? filterType + 'get_protocols,protocol,' : filterType;
    filterType = stateFilter.operation ? filterType + 'get_operations,operation,' : filterType;
    filterType = stateFilter.currentHead ? filterType + 'get_current_head,current_head,' : filterType;
    filterType = stateFilter.currentBranch ? filterType + 'get_current_branch,current_branch,' : filterType;
    filterType = stateFilter.blockHeaders ? filterType + 'get_block_headers,block_header,' : filterType;
    filterType = stateFilter.blockOperations ? filterType + 'get_operations_for_blocks,operations_for_blocks,' : filterType;
    filterType = stateFilter.blockOperationsHashes ? filterType + 'get_operation_hashes_for_blocks,operation_hashes_for_block,' : filterType;

    // remove the last ,
    filterType = filterType.length > 0 ? 'types=' + filterType.slice(0, -1) : '';

    filterType = filterType + (stateFilter.local && !stateFilter.remote ?
      (filterType.length > 0 ? '&source_type=local' : 'source_type=local') :
      !stateFilter.local && stateFilter.remote ? filterType.length > 0 ? '&source_type=remote' : 'source_type=remote' : '');
  }
  // add remote_addr filter
  filterType = filterType + (state.networkAction.urlParams.length ?
    ((filterType.length > 0 ? '&remote_addr=' : 'remote_addr=') + state.networkAction.urlParams) :
    '');

  return filterType;
}
