import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { State, Store } from '@ngrx/store';
import { catchError, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, of, Subject, timer } from 'rxjs';

const endpointsActionDestroy$ = new Subject();

@Injectable()
export class EndpointsActionEffects {

    @Effect()
    EndpointsActionLoad$ = this.actions$.pipe(
        ofType('ENDPOINTS_ACTION_LOAD'),

        withLatestFrom(this.store, (action: any, state: ObservedValueOf<State<Store>>) => ({ action, state })),

        switchMap(({ action, state }) => {
            return this.http.get(state.settingsNode.activeNode.debugger + '/v2/rpc?limit=30' + action.payload);
        }),

        map((payload) => ({ type: 'ENDPOINTS_ACTION_LOAD_SUCCESS', payload })),
        catchError((error, caught) => {
            console.error(error);
            this.store.dispatch({
                type: 'ENDPOINTS_ACTION_LOAD_ERROR',
                payload: error,
            });
            return caught;
        })

    );

    // load logs actions
    @Effect()
    EndpointsActionStartEffect$ = this.actions$.pipe(
        ofType('ENDPOINTS_ACTION_START'),

        // merge state
        withLatestFrom(this.store, (action: any, state: ObservedValueOf<State<Store>>) => ({ action, state })),

        switchMap(({ action, state }) =>

            // get header data every second
            timer(0, 2000).pipe(
                takeUntil(endpointsActionDestroy$),
                switchMap(() =>
                    this.http.get(state.settingsNode.activeNode.debugger + '/v2/rpc/?limit=30').pipe(
                        map(response => ({ type: 'ENDPOINTS_ACTION_START_SUCCESS', payload: response })),
                        catchError(error => of({ type: 'ENDPOINTS_ACTION_START_ERROR', payload: error })),
                    )
                )
            )
        ),
    );

    // stop endpoints action download
    @Effect({ dispatch: false })
    EndpointsActionStopEffect$ = this.actions$.pipe(
        ofType('ENDPOINTS_ACTION_STOP'),
        // merge state
        withLatestFrom(this.store, (action: any, state: ObservedValueOf<State<Store>>) => ({ action, state })),
        // init app modules
        tap(({ action, state }) => {
            endpointsActionDestroy$.next();
        }),
    );

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}
