import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenApiComponent } from './open-api/open-api.component';
import { MemoryProfilerOpenApiComponent } from './memory-profiler-open-api/memory-profiler-open-api.component';
import { NodeOpenApiComponent } from './node-open-api/node-open-api.component';
import { NetworkRecorderOpenApiComponent } from './network-recorder-open-api/network-recorder-open-api.component';

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
        path: 'memory-profiler',
        component: MemoryProfilerOpenApiComponent,
      },
      {
        path: 'network-recorder',
        component: NetworkRecorderOpenApiComponent,
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
