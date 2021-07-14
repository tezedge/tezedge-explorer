import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgressBarService } from './progress-bar.service';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent implements OnInit, AfterViewInit {

  progress$: Observable<number>;
  showProgressBar: boolean;

  private ignoreProgress: boolean;

  constructor(private progressBarService: ProgressBarService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.progress$ = this.progressBarService.progress$.asObservable()
      .pipe(
        filter(() => !this.ignoreProgress),
        tap(value => {
          if (value === 100) {
            this.ignoreProgress = true;
            setTimeout(() => {
              this.ignoreProgress = false;
              setTimeout(() => this.progressBarService.updateGlobalProgress(0), 100);
            }, 200);
          }
        })
      );
  }

  ngAfterViewInit(): void {
    this.showProgressBar = true;
    this.progressBarService.updateGlobalProgress(0);
    this.cdRef.detectChanges();
  }
}
