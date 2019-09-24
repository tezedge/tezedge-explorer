import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, defer, } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable()
export class AppEffects {

    // trigger app init 
    // @Effect()
    // Init$ = defer(() => {
    //     return of({ type: 'APP_INIT' })
    // });

    // effect to debug falling outside of zone
    @Effect({ dispatch: false })
    ZoneDebugEffects$ = this.actions$
        .pipe(
            withLatestFrom(this.store, (action: any, state) => ({ action, state })),
            tap(({ action, state }) => {
                if (NgZone.isInAngularZone() === false) {
                    console.error('[zone][debug]', NgZone.isInAngularZone(), action)
                }
            })
        )

    constructor(
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}