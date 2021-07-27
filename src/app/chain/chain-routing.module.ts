import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChainComponent } from '@chain/chain.component';

const routes: Routes = [
  {
    path: '',
    component: ChainComponent,
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
export class ChainRoutingModule {}
