import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenApiComponent } from './open-api/open-api.component';
import { NodeOpenApiComponent } from './node-open-api/node-open-api.component';

const routes: Routes = [
  {
    path: '',
    component: OpenApiComponent,
    children: [
      {
        path: 'node',
        component: NodeOpenApiComponent,
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'node'
      },
      {
        path: '',
        redirectTo: 'node'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenApiRoutingModule {}
