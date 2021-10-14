import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReplaceCharacterPipe } from './pipes/replace-character.pipe';
import { TimeTransformPipe } from './pipes/time-transform.pipe';
import { ThousandTransformPipe } from './pipes/thousand-transform.pipe';
import { EtaTimePipe } from './pipes/eta-time.pipe';
import { ErrorPopupComponent } from './error-popup/error-popup.component';
import { NotifierModule } from 'angular-notifier';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProgressBarInterceptor } from './progress-bar/progress-bar.interceptor.service';
import { VarDirective } from './directives/var.directive';
import { VirtualScrollDirective } from './virtual-scroll/virtual-scroll.directive';
import { VirtualScrollFromTopDirective } from './virtual-scroll/virtual-scroll-from-top.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { MaterialModule } from '@shared/material.module';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ReactiveFormsModule } from '@angular/forms';
import { NgrxFormDirective } from '@shared/ngrx-form.directive';
import { ResizeDirective } from '@shared/directives/resize.directive';
import { CustomJsonParserInterceptorService } from '@core/custom-json-parser.interceptor.service';


@NgModule({
  declarations: [
    ReplaceCharacterPipe,
    TimeTransformPipe,
    ThousandTransformPipe,
    EtaTimePipe,
    ErrorPopupComponent,
    ProgressBarComponent,
    VarDirective,
    VirtualScrollDirective,
    VirtualScrollFromTopDirective,
    ClickOutsideDirective,
    NgrxFormDirective,
    ResizeDirective,
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
      },
      behaviour: {
        onMouseover: 'pauseAutoHide'
      }
    }),
    MaterialModule,
    NgxJsonViewerModule,
    ReactiveFormsModule,
  ],
  exports: [
    FlexLayoutModule,
    MaterialModule,
    NgxJsonViewerModule,
    ReactiveFormsModule,

    ErrorPopupComponent,
    ProgressBarComponent,

    ReplaceCharacterPipe,
    TimeTransformPipe,
    ThousandTransformPipe,
    EtaTimePipe,

    VarDirective,
    VirtualScrollDirective,
    VirtualScrollFromTopDirective,
    ClickOutsideDirective,
    NgrxFormDirective,
    ResizeDirective,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProgressBarInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomJsonParserInterceptorService,
      multi: true
    },
  ]
})
export class TezedgeSharedModule {}
