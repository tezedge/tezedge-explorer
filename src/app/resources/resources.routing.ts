import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourcesComponent } from './resources/resources.component';
import { SystemResourcesComponent } from './system-resources/system-resources.component';
import { StorageResourcesComponent } from './storage-resources/storage-resources.component';
import { MemoryResourcesComponent } from './memory-resources/memory-resources.component';
import { ResourcesGuard } from './resources.guard';

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
      // {
      //   path: '',
      //   redirectTo: 'system'
      // }
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
