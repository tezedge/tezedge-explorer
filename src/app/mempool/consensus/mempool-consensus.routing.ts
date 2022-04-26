import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MempoolConsensusComponent } from '@mempool/consensus/mempool-consensus.component';

const routes: Routes = [
  {
    path: '',
    component: MempoolConsensusComponent,
    children: [
      {
        path: 'proposals',
        loadChildren: () => import('./baking-rights/mempool-baking-rights/mempool-baking-rights.module').then(m => m.MempoolBakingRightsModule),
      },
      {
        path: 'endorsements',
        loadChildren: () => import('./endorsements/mempool-endorsement/mempool-endorsement.module').then(m => m.MempoolEndorsementModule),
      },
      {
        path: 'pre-endorsements',
        loadChildren: () => import('./endorsements/mempool-endorsement/mempool-endorsement.module').then(m => m.MempoolEndorsementModule),
      },
      {
        path: '',
        redirectTo: 'proposals'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MempoolConsensusRouting {}
