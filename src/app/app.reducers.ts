import {
    ActionReducerMap,
    ActionReducer,
    MetaReducer,
} from '@ngrx/store';
// import { storeLogger } from 'ngrx-store-logger';
import { environment } from '../environments/environment';

import * as fromRouter from '@ngrx/router-store';
import { RouterStateUrl } from './app.routing';

// add remote error loging
//   import * as LogRocket from 'logrocket';
//   import createNgrxMiddleware from 'logrocket-ngrx';
//   const logrocketMiddleware = createNgrxMiddleware(LogRocket);

import * as fromApp from './app.reducer';
import * as fromSettings from './settings/settings.reducer';
import * as fromSettingsNode from './settings/settings-node/settings-node.reducer';

import * as fromNetworkAction from './network/network-action/network-action.reducer';
import * as fromNetworkActionDetail from './network/network-action-detail/network-action-detail.reducer';
import * as fromNetworkPeers from './network/network-peers/network-peers.reducer';
import * as fromNetworkStats from './network/network-stats/network-stats.reducer';
import * as fromNetworkHistory from './network/network-history/network-history.reducer';
import * as fromNetworkEndpoint from './network/network-endpoint/network-endpoint.reducer';

import * as fromEndpointsAction from './endpoints/endpoints-action/endpoints-action.reducer';

import * as fromStorageBlock from './storage/storage-block/storage-block.reducer';
import * as fromStorageAction from './storage/storage-action/storage-action.reducer';

// state interface
export interface State {
    app: any;
    settings: any;
    settingsNode: any;
    networkAction: any;
    networkActionDetail: any;
    networkPeers: any;
    networkStats: any;
    networkHistory: any;
    networkEndpoint: any;
    endpointsAction: any;
    storageBlock: any;
    storageAction: any;
    routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
}

// state
export const reducers: ActionReducerMap<State> = {
    app: fromApp.reducer,
    settings: fromSettings.reducer,
    settingsNode: fromSettingsNode.reducer,
    networkAction: fromNetworkAction.reducer,
    networkActionDetail: fromNetworkActionDetail.reducer,
    networkPeers: fromNetworkPeers.reducer,
    networkStats: fromNetworkStats.reducer,
    networkHistory: fromNetworkHistory.reducer,
    networkEndpoint: fromNetworkEndpoint.reducer,
    endpointsAction: fromEndpointsAction.reducer,
    storageBlock: fromStorageBlock.reducer,
    storageAction: fromStorageAction.reducer,
    routerReducer: fromRouter.routerReducer,
};

// // log all actions to console for production
// export function logger(reducer: ActionReducer<State>): any {
//     // default, no options
//     return storeLogger()(reducer);
// }

// compose all reducers to map
export const metaReducers: MetaReducer<State>[] = !environment.production
    ? []
    : [
    //    logger
    ];
