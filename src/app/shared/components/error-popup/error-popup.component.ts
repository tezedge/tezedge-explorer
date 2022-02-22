import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { selectNewError, selectNewInfo } from './error-popup.reducer';
import { HttpError } from '@shared/types/shared/error-popup/http-error.type';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorPopupComponent implements OnInit {

  @ViewChild('popupTemplate', { static: true })
  private template: TemplateRef<{ title: string, message: string }>;

  constructor(private store: Store<State>,
              private notifierService: NotifierService) { }

  ngOnInit(): void {
    this.listenToErrorEvents();
  }

  private listenToErrorEvents(): void {
    this.store.select(selectNewError).subscribe((error: HttpError) => {
      if (!document.hidden && error) {
        this.notifierService.show({
          type: 'error',
          title: error.title,
          message: error.message,
          template: this.template
        } as any);
      }
    });
    this.store.select(selectNewInfo).subscribe((info: string) => {
      if (!document.hidden && info) {
        this.notifierService.show({
          type: 'info',
          title: info,
          message: '',
          template: this.template
        } as any);
      }
    });
  }
}
