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
import * as fromSettings from './settings/settings.reducer';
import * as fromnetworkPeers from './network/network-peers/network-peers.reducer';
import * as fromnetworkStats from './network/network-stats/network-stats.reducer';
import * as fromnetworkHistory from './network/network-history/network-history.reducer';
import * as fromnetworkEndpoint from './network/network-endpoint/network-endpoint.reducer';

import * as fromStorageBlock from './storage/storage-block/storage-block.reducer';
import * as fromStorageAction from './storage/storage-action/storage-action.reducer';

// state interface
export interface State {
    app: any;
    settings: any,
    networkPeers: any;
    networkStats: any;
    networkHistory: any;
    networkEndpoint: any;
    storageBlock: any;
    storageAction: any;
    routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
}

// state 
export const reducers: ActionReducerMap<State> = {
    app: fromApp.reducer,
    settings: fromSettings.reducer,
    networkPeers: fromnetworkPeers.reducer,
    networkStats: fromnetworkStats.reducer,
    networkHistory: fromnetworkHistory.reducer,
    networkEndpoint: fromnetworkEndpoint.reducer,
    storageBlock: fromStorageBlock.reducer,
    storageAction: fromStorageAction.reducer,
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
