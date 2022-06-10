import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReplaceCharacterPipe } from './pipes/replace-character.pipe';
import { TimeTransformPipe } from './pipes/time-transform.pipe';
import { ThousandTransformPipe } from './pipes/thousand-transform.pipe';
import { VarDirective } from './directives/var.directive';
import { VirtualScrollDirective } from './directives/virtual-scroll.directive';
import { VirtualScrollFromTopDirective } from './directives/virtual-scroll-from-top.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { MaterialModule } from '@shared/material.module';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ReactiveFormsModule } from '@angular/forms';
import { NgrxFormDirective } from '@shared/ngrx-form.directive';
import { ResizeDirective } from '@shared/directives/resize.directive';
import { NanoTransformPipe } from '@shared/pipes/nano-transform.pipe';
import { DateTimePipe } from '@shared/pipes/date-time.pipe';
import { TezedgeChartsModule } from '@shared/components/custom-tezedge-components/tezedge-charts/tezedge-charts.module';
import { TimePickerComponent } from '@shared/components/time-picker/time-picker.component';
import { TezedgeAppSharedModule } from '@shared/tezedge-app-shared.module';
import { HorizontalScrollerComponent } from './components/horizontal-scroller/horizontal-scroller.component';

const COMPONENTS = [
  TimePickerComponent,
  HorizontalScrollerComponent
];

const PIPES = [
  ReplaceCharacterPipe,
  TimeTransformPipe,
  ThousandTransformPipe,
  NanoTransformPipe,
  DateTimePipe,
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
    ...DIRECTIVES,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxJsonViewerModule,
    TezedgeChartsModule,
    ReactiveFormsModule,
    TezedgeAppSharedModule,
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxJsonViewerModule,
    TezedgeChartsModule,
    ReactiveFormsModule,
    TezedgeAppSharedModule,
    ...COMPONENTS,
    ...PIPES,
    ...DIRECTIVES
  ],
  providers: [
    NanoTransformPipe
  ]
})
export class TezedgeSharedModule {}
