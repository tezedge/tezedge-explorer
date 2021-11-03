import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmartContractsComponent } from '@smart-contracts/smart-contracts/smart-contracts.component';

const routes: Routes = [
  {
    path: '',
    component: SmartContractsComponent,
    children: [
      {
        path: ':blockHash',
        component: SmartContractsComponent,
        children: [
          {
            path: ':contractHash',
            component: SmartContractsComponent,
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmartContractsRoutingModule {}
