import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SvgIconComponent } from './svg-icon/svg-icon.component';


@NgModule({
  declarations: [
    SvgIconComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
  ],
  exports: [
    FlexLayoutModule,
    SvgIconComponent,
  ]
})
export class TezedgeSharedModule {}
