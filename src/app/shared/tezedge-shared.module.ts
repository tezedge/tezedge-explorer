import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SvgIconComponent } from './svg-icon/svg-icon.component';
import { ReplaceCharacterPipe } from './pipes/replace-character.pipe';
import { StorageBlockDetailsTimeTransformPipe } from '../storage/storage-block-details/storage-block-details-time-transform.pipe';


@NgModule({
  declarations: [
    SvgIconComponent,
    ReplaceCharacterPipe,
    StorageBlockDetailsTimeTransformPipe,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
  ],
  exports: [
    FlexLayoutModule,
    SvgIconComponent,
    ReplaceCharacterPipe,
    StorageBlockDetailsTimeTransformPipe,
  ]
})
export class TezedgeSharedModule {}
