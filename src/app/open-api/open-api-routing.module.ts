import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenApiComponent } from './open-api/open-api.component';
import { TezedgeOpenApiComponent } from './tezedge-open-api/tezedge-open-api.component';
import { DebuggerOpenApiComponent } from './debugger-open-api/debugger-open-api.component';
import { ProtocolOpenApiComponent } from './protocol-open-api/protocol-open-api.component';

const routes: Routes = [
  {
    path: '',
    component: OpenApiComponent,
    children: [
      {
        path: 'tezedge',
        component: TezedgeOpenApiComponent,
      },
      {
        path: 'debugger',
        component: DebuggerOpenApiComponent,
      },
      {
        path: 'protocol',
        component: ProtocolOpenApiComponent,
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'tezedge'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenApiRoutingModule { }
