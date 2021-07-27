import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MempoolComponent } from '@mempool/mempool.component';

const routes: Routes = [
  {
    path: '',
    component: MempoolComponent,
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
export class MempoolRoutingModule {}
