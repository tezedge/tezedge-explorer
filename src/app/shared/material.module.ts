import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClipboardModule } from '@angular/cdk/clipboard';


@NgModule({
  exports: [
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    ScrollingModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatRadioModule,
    MatTableModule,
    MatListModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    ClipboardModule,
  ]
})
export class MaterialModule { }
