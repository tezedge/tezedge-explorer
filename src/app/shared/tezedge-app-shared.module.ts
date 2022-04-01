import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SpaceNumberPipe } from '@shared/pipes/space-number.pipe';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { NotifierModule } from 'angular-notifier';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatSnackBarModule,
];

const PIPES = [
  SpaceNumberPipe,

];

@NgModule({
  declarations: [
    ...PIPES,
  ],
  imports: [
    CommonModule,
    ...MATERIAL_MODULES,
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
  ],
  exports: [
    ...MATERIAL_MODULES,
    ...PIPES,
    FlexLayoutModule,
    NotifierModule,
  ],
  providers: [
    SpaceNumberPipe,

  ]
})
export class TezedgeAppSharedModule {}
