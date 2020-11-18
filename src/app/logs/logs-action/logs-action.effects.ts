import {Injectable, NgZone} from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {map, switchMap, withLatestFrom, catchError, tap, filter, takeUntil} from 'rxjs/operators';
import {of, Subject, empty, timer} from 'rxjs';

const logActionDestroy$ = new Subject();

@Injectable()
export class LogsActionEffects {

  @Effect()
  LogsActionLoad$ = this.actions$.pipe(
    ofType('LOGS_ACTION_LOAD'),

    // merge state
    withLatestFrom(this.store, (action: any, state) => ({action, state})),

    switchMap(({action, state}) => {
      // console.log('[LOGS_ACTION_LOAD]', action);
      debugger;
      const cursorParam = action.payload && action.payload.cursorId ?
        'cursor_id=' + action.payload.cursorId + '&' :
        '';
      return this.http.get(state.settingsNode.api.debugger + '/v2/log/?' + cursorParam + 'limit=30');
    }),

    // dispatch action
    map((payload) => ({type: 'LOGS_ACTION_LOAD_SUCCESS', payload})),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'LOGS_ACTION_LOAD_ERROR',
        payload: error,
      });
      return caught;
    })
  );

  // load logs actions
  @Effect()
  LogsActionStartEffect$ = this.actions$.pipe(
    ofType('LOGS_ACTION_START'),

    // merge state
    withLatestFrom(this.store, (action: any, state) => ({action, state})),

    switchMap(({action, state}) =>

      // get header data every second
      timer(0, 1000).pipe(
        takeUntil(logActionDestroy$),
        switchMap(() =>
          this.http.get(state.settingsNode.api.debugger + '/v2/log/?limit=30').pipe(
            map(response => ({type: 'LOGS_ACTION_START_SUCCESS', payload: response})),
            catchError(error => of({type: 'LOGS_ACTION_START_ERROR', payload: error})),
          )
        )
      )
    ),
  );

  // stop logs action download
  @Effect({dispatch: false})
  LogsActionStopEffect$ = this.actions$.pipe(
    ofType('LOGS_ACTION_STOP'),
    // merge state
    withLatestFrom(this.store, (action: any, state) => ({action, state})),
    // init app modules
    tap(({action, state}) => {
      // console.log('[LOGS_ACTION_STOP] stream', state.logsAction.stream);
      // close all open observables
      // if (state.logsAction.stream) {
      logActionDestroy$.next();
      // }
    }),
  );

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private store: Store<any>,
  ) {
  }

}
