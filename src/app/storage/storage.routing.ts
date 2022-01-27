import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StorageComponent } from './storage.component';
import { StorageBlockComponent } from './storage-block/storage-block.component';
import { StorageGuard } from './storage.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [StorageGuard],
    component: StorageComponent,
    children: [
      {
        path: '',
        component: StorageBlockComponent,
        children: [
          {
            path: ':hash',
            component: StorageBlockComponent
          }
        ]
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
export class StorageRoutingModule {}
