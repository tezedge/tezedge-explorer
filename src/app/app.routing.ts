import { Routes } from '@angular/router'
import { RouterStateSnapshot, Params } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

import { NetworkingComponent } from './networking/networking.component';
import { StorageComponent } from './storage/storage.component';
import { StorageActionComponent } from './storage/storage-action/storage-action.component';
import { SettingsComponent } from './settings/settings.component';

export const AppRouting: Routes = [

  // lazy load module
  //   { path: 'networking', loadChildren: 'app/networking/networking.module#NetworkingModule' },

  { path: 'networking', component: NetworkingComponent },
  { path: 'storage', component: StorageComponent },
  { path: 'storage/:blockId', component: StorageActionComponent },

  { path: 'settings', component: SettingsComponent },

  { path: '', redirectTo: '/storage', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent }

];

// router interface
export interface RouterStateUrl {
  url: string;
  queryParams: Params;
}

// create custom router
export class CustomRouterStateSerializer
  implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const queryParams = routerState.root.queryParams;
    return { url, queryParams };
  }
}