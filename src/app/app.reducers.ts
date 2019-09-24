import {
    ActionReducerMap,
    ActionReducer,
    MetaReducer,
} from '@ngrx/store';
import { storeLogger } from 'ngrx-store-logger';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../environments/environment';

import * as fromRouter from '@ngrx/router-store';
import { RouterStateUrl } from './app.routing';

// add remote error loging
//   import * as LogRocket from 'logrocket';
//   import createNgrxMiddleware from 'logrocket-ngrx';
//   const logrocketMiddleware = createNgrxMiddleware(LogRocket);

import * as fromApp from './app.reducer';
import * as fromNetworkingPeers from './networking/networking-peers/networking-peers.reducer';

// state interface
export interface State {
    app: any;
    networkingPeers: any;
    routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
}

// state 
export const reducers: ActionReducerMap<State> = {
    app: fromApp.reducer,
    networkingPeers: fromNetworkingPeers.reducer,
    routerReducer: fromRouter.routerReducer,
};

// log all actions to console for production
export function logger(reducer: ActionReducer<State>): any {
    // default, no options
    return storeLogger()(reducer);
}

// compose all reducers to map
export const metaReducers: MetaReducer<State>[] = !environment.production
    ? [storeFreeze]
    : [logger];
