import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MempoolEndorsementComponent } from '@mempool/consensus/endorsements/mempool-endorsement/mempool-endorsement.component';

const routes: Routes = [
  {
    path: '',
    component: MempoolEndorsementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MempoolEndorsementRouting { }
