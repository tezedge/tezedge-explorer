import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';

@Injectable()
export class LogsActionEffects {

    @Effect()
    LogsActionLoad$ = this.actions$.pipe(
        ofType('LOGS_ACTION_LOAD'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),

        switchMap(({ action, state }) => {
            console.log('[LOGS_ACTION_LOAD]', action)
            const cursor_id = action.payload ? 'cursor_id=' + action.payload +'&' : '';
            return this.http.get(state.settingsNode.api.debugger + '/v2/log/?' + cursor_id + 'limit=1000');
        }),

        // dispatch action
        map((payload) => ({ type: 'LOGS_ACTION_LOAD_SUCCESS', payload: payload })),
        catchError((error, caught) => {
            console.error(error);
            this.store.dispatch({
                type: 'LOGS_ACTION_LOAD_ERROR',
                payload: error,
            });
            return caught;
        })

    );

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}