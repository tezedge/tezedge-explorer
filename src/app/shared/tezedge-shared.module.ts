import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReplaceCharacterPipe } from './pipes/replace-character.pipe';
import { TimeTransformPipe } from './pipes/time-transform.pipe';
import { ThousandTransformPipe } from './pipes/thousand-transform.pipe';
import { EtaTimePipe } from './pipes/eta-time.pipe';
import { ErrorPopupComponent } from './error-popup/error-popup.component';
import { NotifierModule } from 'angular-notifier';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { LoadingSpinnerComponent } from '@shared/loading-spinner/loading-spinner.component';
import { NanoTransformPipe } from '@shared/pipes/nano-transform.pipe';

const COMPONENTS = [
  ErrorPopupComponent,
  LoadingSpinnerComponent,
];

const PIPES = [
  ReplaceCharacterPipe,
  TimeTransformPipe,
  ThousandTransformPipe,
  EtaTimePipe,
  NanoTransformPipe,
];

const DIRECTIVES = [
  VarDirective,
  VirtualScrollDirective,
  VirtualScrollFromTopDirective,
  ClickOutsideDirective,
  NgrxFormDirective,
  ResizeDirective,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...PIPES,
    ...DIRECTIVES
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
        onMouseover: 'pauseAutoHide',
        autoHide: false
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
    ...COMPONENTS,
    ...PIPES,
    ...DIRECTIVES
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomJsonParserInterceptorService,
      multi: true
    },
  ]
})
export class TezedgeSharedModule {}
