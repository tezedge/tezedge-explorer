import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BakingComponent } from '@app/baking/baking/baking.component';

const routes: Routes = [
  {
    path: '',
    component: BakingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BakingRouting { }
