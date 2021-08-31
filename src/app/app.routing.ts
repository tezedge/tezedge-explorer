import { Params, RouterStateSnapshot, Routes } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

export const AppRouting: Routes = [
  {
    path: 'monitoring',
    loadChildren: () => import('./monitoring/monitoring.module').then(module => module.MonitoringModule)
  },
  {
    path: 'resources',
    loadChildren: () => import('./resources/resources.module').then(module => module.ResourcesModule)
  },
  {
    path: 'mempool',
    loadChildren: () => import('./mempool/mempool.module').then(module => module.MempoolModule)
  },
  {
    path: 'network',
    loadChildren: () => import('./network/network.module').then(module => module.NetworkModule)
  },
  {
    path: 'endpoints',
    loadChildren: () => import('./endpoints/endpoints.module').then(module => module.EndpointsModule)
  },
  {
    path: 'storage',
    loadChildren: () => import('./storage/storage.module').then(module => module.StorageModule)
  },
  {
    path: 'state',
    loadChildren: () => import('./state-machine/state-machine.module').then(module => module.StateMachineModule)
  },
  {
    path: 'logs',
    loadChildren: () => import('./logs/logs.module').then(module => module.LogsModule)
  },
  {
    path: 'chain',
    loadChildren: () => import('./chain/chain.module').then(module => module.ChainModule)
  },
  {
    path: 'wallets',
    loadChildren: () => import('./wallets/wallets.module').then(module => module.WalletsModule)
  },
  {
    path: 'sandbox',
    loadChildren: () => import('./sandbox/sandbox.module').then(module => module.SandboxModule)
  },
  {
    path: 'open-api',
    loadChildren: () => import('./open-api/open-api.module').then(module => module.OpenApiModule)
  },
  {
    path: '',
    redirectTo: 'monitoring',
    pathMatch: 'full'
  },
];

// router interface
export interface RouterStateUrl {
  url: string;
  queryParams: Params;
}

// create custom router
export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const queryParams = routerState.root.queryParams;
    return { url, queryParams };
  }
}
