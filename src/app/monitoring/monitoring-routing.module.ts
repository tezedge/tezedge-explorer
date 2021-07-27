import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonitoringComponent } from '@monitoring/monitoring.component';

const routes: Routes = [
  {
    path: '',
    component: MonitoringComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoringRoutingModule { }
