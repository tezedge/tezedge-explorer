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

// meta reducer for dynamic forms
import * as fromNgrxForm from './shared/ngrx-form.reducer';


import * as fromApp from './app.reducer';
import * as fromSettings from './settings/settings.reducer';
import * as fromSettingsNode from './settings/settings-node/settings-node.reducer';

import * as fromMonitoring from './monitoring/monitoring.reducer';

import * as fromNetworkAction from './network/network-action/network-action.reducer';
import * as fromNetworkActionDetail from './network/network-action-detail/network-action-detail.reducer';
import * as fromNetworkPeers from './network/network-peers/network-peers.reducer';
import * as fromNetworkStats from './network/network-stats/network-stats.reducer';
import * as fromNetworkHistory from './network/network-history/network-history.reducer';
import * as fromNetworkEndpoint from './network/network-endpoint/network-endpoint.reducer';

import * as fromEndpointsAction from './endpoints/endpoints-action/endpoints-action.reducer';

import * as fromChainServer from './chain/chain-server/chain-server.reducer';
import * as fromChainWallets from './chain/chain-wallets/chain-wallets.reducer';
import * as fromChainConfig from './chain/chain-config/chain-config.reducer';
import * as fromChainFinish from './chain/chain-finish/chain-finish.reducer';

import * as fromLogsAction from './logs/logs-action/logs-action.reducer';

import * as fromStorageBlock from './storage/storage-block/storage-block.reducer';
import * as fromStorageAction from './storage/storage-action/storage-action.reducer';

import * as fromSandbox from './sandbox/sandbox.reducer';

// state interface
export interface State {
    app: any;
    monitoring: any;
    networkAction: any;
    networkActionDetail: any;
    networkPeers: any;
    networkStats: any;
    networkHistory: any;
    networkEndpoint: any;
    endpointsAction: any;
    logsAction: any;
    storageBlock: any;
    storageAction: any;
    chainServer: any;
    chainWallets: any;
    chainConfig: any;
    chainFinish: any;
    settings: any;
    settingsNode: any;
    sandbox: any;
    routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
}

// state
export const reducers: ActionReducerMap<State> = {
    app: fromApp.reducer,
    monitoring: fromMonitoring.reducer,
    networkAction: fromNetworkAction.reducer,
    networkActionDetail: fromNetworkActionDetail.reducer,
    networkPeers: fromNetworkPeers.reducer,
    networkStats: fromNetworkStats.reducer,
    networkHistory: fromNetworkHistory.reducer,
    networkEndpoint: fromNetworkEndpoint.reducer,
    endpointsAction: fromEndpointsAction.reducer,
    logsAction: fromLogsAction.reducer,
    storageBlock: fromStorageBlock.reducer,
    storageAction: fromStorageAction.reducer,
    chainServer: fromChainServer.reducer,
    chainWallets: fromChainWallets.reducer,
    chainConfig: fromChainConfig.reducer,
    chainFinish: fromChainFinish.reducer,
    sandbox: fromSandbox.reducer,
    settings: fromSettings.reducer,
    settingsNode: fromSettingsNode.reducer,
    routerReducer: fromRouter.routerReducer,
};

// // log all actions to console for production
// export function logger(reducer: ActionReducer<State>): any {
//     // default, no options
//     return storeLogger()(reducer);
// }

// compose all reducers to map
export const metaReducers: MetaReducer<State>[] = !environment.production
    ? [fromNgrxForm.form]
    : [fromNgrxForm.form
    //    ,logger
    ];
