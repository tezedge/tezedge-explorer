import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SvgIconComponent } from './svg-icon/svg-icon.component';
import { ReplaceCharacterPipe } from './pipes/replace-character.pipe';
import { TimeTransformPipe } from './pipes/time-transform.pipe';
import { ThousandTransformPipe } from './pipes/thousand-transform.pipe';
import { EtaTimePipe } from './pipes/eta-time.pipe';
import { SwaggerComponent } from './swagger/swagger.component';
import { ErrorPopupComponent } from './error-popup/error-popup.component';
import { NotifierModule } from 'angular-notifier';


@NgModule({
  declarations: [
    SvgIconComponent,
    ReplaceCharacterPipe,
    TimeTransformPipe,
    ThousandTransformPipe,
    EtaTimePipe,
    SwaggerComponent,
    ErrorPopupComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right'
        },
        vertical: {
          position: 'top'
        }
      }
    }),
  ],
  exports: [
    FlexLayoutModule,
    SvgIconComponent,
    ReplaceCharacterPipe,
    TimeTransformPipe,
    ThousandTransformPipe,
    EtaTimePipe,
    ErrorPopupComponent,
  ]
})
export class TezedgeSharedModule {}
