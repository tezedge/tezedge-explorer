import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SvgIconComponent } from './svg-icon/svg-icon.component';
import { ReplaceCharacterPipe } from './pipes/replace-character.pipe';
import { TimeTransformPipe } from './pipes/time-transform.pipe';
import { ThousandTransformPipe } from './pipes/thousand-transform.pipe';
import { EtaTimePipe } from './pipes/eta-time.pipe';


@NgModule({
  declarations: [
    SvgIconComponent,
    ReplaceCharacterPipe,
    TimeTransformPipe,
    ThousandTransformPipe,
    EtaTimePipe,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
  ],
  exports: [
    FlexLayoutModule,
    SvgIconComponent,
    ReplaceCharacterPipe,
    TimeTransformPipe,
    ThousandTransformPipe,
    EtaTimePipe,
  ]
})
export class TezedgeSharedModule {}
