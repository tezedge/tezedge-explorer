import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmbeddedComponent } from '@app/embedded/embedded/embedded.component';

const routes: Routes = [
  {
    path: '',
    component: EmbeddedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmbeddedRouting { }
