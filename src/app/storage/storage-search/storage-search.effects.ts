import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { tap, map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

@Injectable()
export class StorageSearchEffects {


    
    @Effect()
    StorageSearch$ = this.actions$.pipe(
        ofType('STORAGE_SEARCH'),

        // change data structure
        tap((action:any) => {
            console.log('[STORAGE_SEARCH]', action.payload)
            this.router.navigate(['/storage', action.payload]);
        }),
        
        map((payload) => ({ type: 'STORAGE_SEARCH_SUCCESS', payload: payload })),
        catchError((error, caught) => {
            console.error(error)
            this.store.dispatch({
                type: 'STORAGE_SEARCH_ERROR',
                payload: error,
            });
            return caught;
        })

    )
    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
    ) { }

}