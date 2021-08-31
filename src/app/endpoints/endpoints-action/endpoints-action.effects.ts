import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { State, Store } from '@ngrx/store';
import { catchError, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, of, Subject, timer } from 'rxjs';

const endpointsActionDestroy$ = new Subject();

@Injectable({ providedIn: 'root' })
export class EndpointsActionEffects {


    EndpointsActionLoad$ = createEffect(() => this.actions$.pipe(
        ofType('ENDPOINTS_ACTION_LOAD'),

        withLatestFrom(this.store, (action: any, state: ObservedValueOf<State<Store>>) => ({ action, state })),

        switchMap(({ action, state }) => {
            return this.http.get(state.settingsNode.activeNode.features.find(f => f.name === 'debugger').url + '/v2/rpc?limit=30' + action.payload);
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

    ));

    // load logs actions

    EndpointsActionStartEffect$ = createEffect(() => this.actions$.pipe(
        ofType('ENDPOINTS_ACTION_START'),

        // merge state
        withLatestFrom(this.store, (action: any, state: ObservedValueOf<State<Store>>) => ({ action, state })),

        switchMap(({ action, state }) =>

            // get header data every second
            timer(0, 2000).pipe(
                takeUntil(endpointsActionDestroy$),
                switchMap(() =>
                    this.http.get(state.settingsNode.activeNode.features.find(f => f.name === 'debugger').url + '/v2/rpc/?limit=30').pipe(
                        map(response => ({ type: 'ENDPOINTS_ACTION_START_SUCCESS', payload: response })),
                        catchError(error => of({ type: 'ENDPOINTS_ACTION_START_ERROR', payload: error })),
                    )
                )
            )
        ),
    ));

    // stop endpoints action download

    EndpointsActionStopEffect$ = createEffect(() => this.actions$.pipe(
        ofType('ENDPOINTS_ACTION_STOP'),
        // merge state
        withLatestFrom(this.store, (action: any, state: ObservedValueOf<State<Store>>) => ({ action, state })),
        // init app modules
        tap(({ action, state }) => {
            endpointsActionDestroy$.next(null);
        }),
    ), { dispatch: false });

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}
