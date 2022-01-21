import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReplaceCharacterPipe } from './pipes/replace-character.pipe';
import { TimeTransformPipe } from './pipes/time-transform.pipe';
import { ThousandTransformPipe } from './pipes/thousand-transform.pipe';
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
import { DateTimePipe } from '@shared/pipes/date-time.pipe';
import { SpaceNumberPipe } from '@shared/pipes/space-number.pipe';
import { TezedgeChartsModule } from '@shared/charts/tezedge-charts.module';

const COMPONENTS = [
  ErrorPopupComponent,
  LoadingSpinnerComponent,
];

const PIPES = [
  ReplaceCharacterPipe,
  TimeTransformPipe,
  ThousandTransformPipe,
  NanoTransformPipe,
  DateTimePipe,
  SpaceNumberPipe,
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
    FlexLayoutModule,
    MaterialModule,
    NgxJsonViewerModule,
    TezedgeChartsModule,
    ReactiveFormsModule,
  ],
  exports: [
    FlexLayoutModule,
    MaterialModule,
    NgxJsonViewerModule,
    TezedgeChartsModule,
    ReactiveFormsModule,
    ...COMPONENTS,
    ...PIPES,
    ...DIRECTIVES
  ],
  providers: [
    SpaceNumberPipe,
    NanoTransformPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomJsonParserInterceptorService,
      multi: true
    },
  ]
})
export class TezedgeSharedModule {}
