import { ActionReducer, ActionReducerMap, MetaReducer, } from '@ngrx/store';

// add remote error loging
//   import * as LogRocket from 'logrocket';
//   import createNgrxMiddleware from 'logrocket-ngrx';
//   const logrocketMiddleware = createNgrxMiddleware(LogRocket);
// meta reducer for dynamic forms
import * as fromNgrxForm from './shared/ngrx-form.reducer';
import * as fromApp from './app.reducer';
import * as fromBaking from './baking/baking.reducer';
import * as fromSettingsNode from './layout/settings-node/settings-node.reducer';
import * as fromMonitoring from './monitoring/monitoring.reducer';
import * as fromMempool from './mempool/mempool.reducer';
import * as fromNetworkAction from './network/network-action/network-action.reducer';
import * as fromEmbedded from './embedded/embedded.reducer';
import * as fromEndpointsAction from './endpoints/endpoints-action/endpoints-action.reducer';
import * as fromChainServer from './chain/chain-server/chain-server.reducer';
import * as fromChainWallets from './chain/chain-wallets/chain-wallets.reducer';
import * as fromChainConfig from './chain/chain-config/chain-config.reducer';
import * as fromChainFinish from './chain/chain-finish/chain-finish.reducer';
import * as fromLogsAction from './logs/logs-action/logs-action.reducer';
import * as fromStorage from './storage/storage.reducer';
import * as fromStorageAction from './storage/storage-action/storage-action.reducer';
import * as fromSandbox from './sandbox/sandbox.reducer';
import * as fromWallets from './wallets/wallets.reducer';
import * as fromVersion from './layout/github-version/github-version.reducer';
import * as fromResources from './resources/resources.reducer';
import * as fromError from './layout/error-popup/error-popup.reducer';
import * as fromStateMachine from './state-machine/state-machine/state-machine.reducer';
import * as fromSmartContracts from './smart-contracts/smart-contracts/smart-contracts.reducer';
import * as fromSpinner from './layout/loading-spinner/loading-spinner.reducer';

import { MempoolState } from '@mempool/mempool.reducer';
import { ResourcesState } from '@resources/resources.reducer';
import { ErrorState } from '@app/layout/error-popup/error-popup.reducer';
import { SettingsNode } from '@shared/types/settings-node/settings-node.type';
import { NetworkAction } from '@shared/types/network/network-action.type';
import { App } from '@shared/types/app/app.type';
import { LogsAction } from '@shared/types/logs/logs-action.type';
import { GithubVersion } from '@shared/types/github-version/github-version.type';
import { StateMachine } from '@shared/types/state-machine/state-machine.type';
import { SmartContractsState } from '@smart-contracts/smart-contracts/smart-contracts.index';
import { LoadingSpinnerState } from '@app/layout/loading-spinner/loading-spinner.reducer';
import { StorageState } from '@storage/storage.index';
import { BakingState } from '@baking/baking.index';
import { MonitoringState } from '@monitoring/monitoring.index';
import { EmbeddedState } from '@app/embedded/embedded.index';

export interface State {
  app: App;
  baking: BakingState;
  monitoring: MonitoringState;
  mempool: MempoolState;
  networkAction: NetworkAction;
  embedded: EmbeddedState;
  endpointsAction: any;
  logsAction: LogsAction;
  storage: StorageState;
  storageAction: any;
  chainServer: any;
  chainWallets: any;
  chainConfig: any;
  chainFinish: any;
  settingsNode: SettingsNode;
  sandbox: any;
  wallets: any;
  error: ErrorState;
  githubVersion: GithubVersion;
  resources: ResourcesState;
  stateMachine: StateMachine;
  smartContracts: SmartContractsState;
  spinner: LoadingSpinnerState;
}

export const reducers: ActionReducerMap<State> = {
  app: fromApp.reducer,
  baking: fromBaking.reducer,
  chainConfig: fromChainConfig.reducer,
  chainFinish: fromChainFinish.reducer,
  chainServer: fromChainServer.reducer,
  chainWallets: fromChainWallets.reducer,
  embedded: fromEmbedded.reducer,
  endpointsAction: fromEndpointsAction.reducer,
  error: fromError.reducer,
  githubVersion: fromVersion.reducer,
  logsAction: fromLogsAction.reducer,
  mempool: fromMempool.reducer,
  monitoring: fromMonitoring.reducer,
  networkAction: fromNetworkAction.reducer,
  resources: fromResources.reducer,
  sandbox: fromSandbox.reducer,
  settingsNode: fromSettingsNode.reducer,
  smartContracts: fromSmartContracts.reducer,
  spinner: fromSpinner.reducer,
  stateMachine: fromStateMachine.reducer,
  storage: fromStorage.reducer,
  storageAction: fromStorageAction.reducer,
  wallets: fromWallets.reducer,
};

export const metaReducers: MetaReducer<State>[] = [fromNgrxForm.form, nodeSwitchStateMetaReducer];

export function nodeSwitchStateMetaReducer(reducer: ActionReducer<State>): ActionReducer<State> {
  return function clearStateFn(state: State, action: any) {
    if (action.type === 'APP_NODE_CHANGE') {
      state = {
        app: {
          ...state.app,
          initialized: false
        },
        settingsNode: {
          activeNode: state.settingsNode.entities[action.payload.activeNode.id],
          entities: { ...state.settingsNode.entities },
          ids: [...state.settingsNode.ids],
        } as SettingsNode
      } as State;
    }
    return reducer(state, action);
  };
}

export const selectTezedgeState = (state: State): State => state;
