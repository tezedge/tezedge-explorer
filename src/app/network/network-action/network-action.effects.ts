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
            return this.http.get(state.settingsNode.api.debugger + '/v2/p2p/?limit=300' + action.payload)
        }),

        // dispatch action
        map((payload) => ({ type: 'NETWORK_ACTION_LOAD_SUCCESS', payload: payload })),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'NETWORK_ACTION_LOAD_ERROR',
                payload: error,
            });
            return caught;
        })

    )

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
                    this.http.get(state.settingsNode.api.debugger + '/v2/p2p/?' +  networkActionFilter(action, state) + 'limit=300').pipe(
                        map(response => ({ type: 'NETWORK_ACTION_START_SUCCESS', payload: response })),
                        catchError(error => of({ type: 'NETWORK_ACTION_START_ERROR', payload: error })),
                    )
                )
            )
        ),
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
        }),
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
            console.error(error)
            this.store.dispatch({
                type: 'NETWORK_ACTION_FILTER_ERROR',
                payload: error,
            });
            return caught;
        })

    )

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}

// filter network action
export function networkActionFilter(action, state) {

    let filter = '';
    const stateFilter = state.networkAction.filter;
    
    filter = stateFilter.local ? filter + 'local,' : filter;
    filter = stateFilter.remote ? filter + 'remote,' : filter;

    filter = stateFilter.meta ? filter + 'metadata,' : filter;
    filter = stateFilter.connection ? filter + 'connection_message,' : filter;
    filter = stateFilter.bootstrap ? filter + 'bootstrap,' : filter;
    filter = stateFilter.advertise ? filter + 'advertise,' : filter;
    filter = stateFilter.swap ? filter + 'swap_request,swap_ack,' : filter;
    filter = stateFilter.deactivate ? filter + 'deactivate,' : filter;

    filter = stateFilter.protocol ? filter + 'get_protocols,protocol,' : filter;
    filter = stateFilter.operation ? filter + 'get_operations,operation,' : filter;
    filter = stateFilter.currentHead ? filter + 'get_current_head,current_head,' : filter;
    filter = stateFilter.currentBranch ? filter + 'get_current_branch,current_branch,' : filter;
    filter = stateFilter.blockHeaders ? filter + 'get_block_header,block_header,' : filter;
    filter = stateFilter.blockOperations ? filter + 'get_operations_for_blocks,operations_for_blocks,' : filter;
    filter = stateFilter.blockOperationsHashes ? filter + 'get_operation_hashes_for_blocks,operation_hashes_for_block,' : filter;

    // replace last , with &
    filter = filter.length > 0 ?  'types=' + filter.slice(0, -1) + '&' : '';  
    // console.log("[networkActionFilter] url ", state.settingsNode.api.debugger + '/v2/p2p/?' + filter + 'limit=10');

    return filter

}