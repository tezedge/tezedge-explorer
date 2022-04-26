import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MempoolConsensusComponent } from '@mempool/consensus/mempool-consensus.component';
import { MempoolBakingRightsComponent } from '@mempool/consensus/baking-rights/mempool-baking-rights/mempool-baking-rights.component';
import { MempoolEndorsementComponent } from '@mempool/consensus/endorsements/mempool-endorsement/mempool-endorsement.component';
import { MempoolPreEndorsementComponent } from '@mempool/consensus/preendorsements/mempool-pre-endorsement/mempool-pre-endorsement.component';

const routes: Routes = [
  {
    path: '',
    component: MempoolConsensusComponent,
    children: [
      {
        path: 'proposals',
        component: MempoolBakingRightsComponent,
        children: [
          {
            path: ':block',
            component: MempoolBakingRightsComponent
          }
        ]
      },
      {
        path: 'endorsements',
        component: MempoolEndorsementComponent,
      },
      {
        path: 'pre-endorsements',
        component: MempoolPreEndorsementComponent,
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
