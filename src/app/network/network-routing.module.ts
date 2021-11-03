import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkComponent } from '@network/network.component';
import { NetworkGuard } from '@network/network.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [NetworkGuard],
    component: NetworkComponent,
  },
  {
    path: ':address',
    canActivate: [NetworkGuard],
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
