import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletsComponent } from '@wallets/wallets.component';

const routes: Routes = [
  {
    path: '',
    component: WalletsComponent,
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
export class WalletsRoutingModule {}
