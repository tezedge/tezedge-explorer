import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, map, switchMap, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable()
export class SettingsNodeEffects {

    constructor(
        private actions$: Actions,
        private store: Store<any>,
    ) { }

}
