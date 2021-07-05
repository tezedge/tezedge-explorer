import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenApiComponent } from './open-api/open-api.component';
import { DebuggerOpenApiComponent } from './debugger-open-api/debugger-open-api.component';
import { NodeOpenApiComponent } from './node-open-api/node-open-api.component';
import { ProtocolOpenApiComponent } from './protocol-open-api/protocol-open-api.component';

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
        component: DebuggerOpenApiComponent,
      },
      {
        path: 'network-recorder',
        component: ProtocolOpenApiComponent,
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
