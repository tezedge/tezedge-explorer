import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkComponent } from '@network/network.component';

const routes: Routes = [
  {
    path: '',
    component: NetworkComponent,
  },
  {
    path: ':address',
    component: NetworkComponent,
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
export class NetworkRoutingModule {}
