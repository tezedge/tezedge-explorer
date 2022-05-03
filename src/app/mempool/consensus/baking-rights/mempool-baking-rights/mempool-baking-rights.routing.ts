import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MempoolBakingRightsComponent } from '@mempool/consensus/baking-rights/mempool-baking-rights/mempool-baking-rights.component';

const routes: Routes = [
  {
    path: '',
    component: MempoolBakingRightsComponent,
    children: [
      {
        path: ':block',
        component: MempoolBakingRightsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MempoolBakingRightsRouting {}
