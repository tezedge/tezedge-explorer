import {Injectable} from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {tap, map, switchMap, withLatestFrom, catchError, takeUntil} from 'rxjs/operators';


@Injectable()
export class StorageActionEffects {

  @Effect()
  StorageBlockAction$ = this.actions$.pipe(
    ofType('STORAGE_BLOCK_ACTION_LOAD'),

    // merge state
    withLatestFrom(this.store, (action: any, state) => ({action, state})),

    switchMap(({action, state}) => {
      return this.http.get(setUrl(action, state));
    }),
    // dispatch action
    map((payload) => ({type: 'STORAGE_BLOCK_ACTION_LOAD_SUCCESS', payload})),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'STORAGE_BLOCK_ACTION_LOAD_ERROR',
        payload: error,
      });
      return caught;
    })
  );

  @Effect()
  StorageBlockActionDetails$ = this.actions$.pipe(
    ofType('STORAGE_BLOCK_ACTION_DETAILS_LOAD'),

    // merge state
    withLatestFrom(this.store, (action: any, state) => ({action, state})),

    switchMap(({action, state}) => {
      return this.http.get(setDetailsUrl(action, state));
    }),
    // dispatch action
    map((payload) => ({type: 'STORAGE_BLOCK_ACTION_DETAILS_LOAD_SUCCESS', payload})),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'STORAGE_BLOCK_ACTION_DETAILS_LOAD_ERROR',
        payload: error,
      });
      return caught;
    })
  );

  // @Effect()
  // StorageAddressAction$ = this.actions$.pipe(
  //   ofType('STORAGE_ADDRESS_ACTION_LOAD'),
  //
  //   // merge state
  //   withLatestFrom(this.store, (action: any, state) => ({action, state})),
  //
  //   switchMap(({action, state}) => {
  //     return this.http.get(state.settingsNode.api.http + '/dev/chains/main/actions/contracts/' + action.payload.addressHanpm sh + '?limit=30');
  //   }),
  //   // change data structure
  //   map((payload: any) => payload.data.map(action => action.action)),
  //   // tap(payload => console.log('[STORAGE_BLOCK_ACTION_LOAD]', payload)),
  //   // dispatch action
  //   map((payload) => ({type: 'STORAGE_ADDRESS_ACTION_LOAD_SUCCESS', payload})),
  //   catchError((error, caught) => {
  //     console.error(error);
  //     this.store.dispatch({
  //       type: 'STORAGE_ADDRESS_ACTION_LOAD_ERROR',
  //       payload: error,
  //     });
  //     return caught;
  //   })
  // );

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private store: Store<any>,
  ) {
  }

}

export function setUrl(action, state) {
  const url = state.settingsNode.api.http + '/dev/chains/main/actions/blocks/' + action.payload.blockHash + '/?';
  const cursor = storageActionCursor(action);
  const filters = ''; // use it when we need to filter the list
  const limit = storageActionLimit(action);

  return `${url}${filters.length ? `${filters}&` : ''}${cursor.length ? `${cursor}&` : ''}${limit}`;
}

// use limit to load just the necessary number of records
function storageActionLimit(action) {
  const limitNr = action.payload && action.payload.limit && action.payload.limit > 60 ?
    action.payload.limit :
    '60';

  return `limit=${limitNr}`;
}

// use cursor to load previous pages
function storageActionCursor(action) {
  return action.payload && action.payload.cursor_id ?
    `cursor_id=${action.payload.cursor_id}` :
    '';
}

export function setDetailsUrl(action, state) {
  return state.settingsNode.api.http + '/dev/chains/main/actions/blocks/' + action.payload.blockHash + '/details/';
}
