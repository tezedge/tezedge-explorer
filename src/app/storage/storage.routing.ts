import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StorageComponent } from './storage.component';
import { StorageBlockComponent } from './storage-block/storage-block.component';
import { StorageGuard } from './storage.guard';
import { StorageRequestComponent } from '@storage/storage-request/storage-request.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [StorageGuard],
    component: StorageComponent,
    children: [
      {
        path: 'blocks',
        component: StorageBlockComponent,
        children: [
          {
            path: ':hash',
            component: StorageBlockComponent
          }
        ]
      },
      {
        path: 'requests',
        component: StorageRequestComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'blocks'
      },
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'blocks'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorageRoutingModule {}
