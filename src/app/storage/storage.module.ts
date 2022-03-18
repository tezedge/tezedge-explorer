import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageRoutingModule } from './storage.routing';
import { TezedgeSharedModule } from '@shared/tezedge-shared.module';
import { StorageComponent } from './storage.component';
import { StorageBlockComponent } from './storage-block/storage-block.component';
import { StorageBlockDetailsComponent } from './storage-block-details/storage-block-details.component';
import { StorageActionComponent } from './storage-action/storage-action.component';
import { StorageSearchComponent } from './storage-search/storage-search.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { StorageRequestComponent } from './storage-request/storage-request.component';


@NgModule({
  declarations: [
    StorageComponent,
    StorageBlockComponent,
    StorageBlockDetailsComponent,
    StorageActionComponent,
    StorageSearchComponent,
    StorageRequestComponent,
  ],
  imports: [
    CommonModule,
    StorageRoutingModule,
    TezedgeSharedModule,
    MatFormFieldModule,
    FormsModule,
  ]
})
export class StorageModule {}
