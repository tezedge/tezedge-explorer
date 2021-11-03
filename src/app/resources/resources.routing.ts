import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourcesComponent } from './resources/resources.component';
import { SystemResourcesComponent } from './system-resource/system-resources/system-resources.component';
import { StorageResourcesComponent } from './storage-resource/storage-resources/storage-resources.component';
import { MemoryResourcesComponent } from './memory-resources/memory-resources.component';
import { ResourcesGuard } from './resources.guard';
import { StateResourcesComponent } from '@resources/state-resources/state-resources/state-resources.component';

const routes: Routes = [
  {
    path: '',
    component: ResourcesComponent,
    children: [
      {
        path: 'system',
        canActivate: [ResourcesGuard],
        component: SystemResourcesComponent
      },
      {
        path: 'storage',
        canActivate: [ResourcesGuard],
        component: StorageResourcesComponent
      },
      {
        path: 'memory',
        canActivate: [ResourcesGuard],
        component: MemoryResourcesComponent
      },
      {
        path: 'state',
        canActivate: [ResourcesGuard],
        component: StateResourcesComponent,
        children: [
          {
            path: ':level',
            component: StateResourcesComponent,
            children: [
              {
                path: ':round',
                component: StateResourcesComponent,
              },
              {
                path: '',
                redirectTo: '0'
              }
            ]
          },
        ]
      },
      {
        path: '',
        redirectTo: 'system'
      }
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourcesRoutingModule { }
