import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';

@Injectable()
export class SettingsEffects {

    constructor(
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}
