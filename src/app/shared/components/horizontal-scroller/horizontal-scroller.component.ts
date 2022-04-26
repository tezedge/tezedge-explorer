import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { debounceTime, fromEvent } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'tezedge-horizontal-scroller',
  templateUrl: './horizontal-scroller.component.html',
  styleUrls: ['./horizontal-scroller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HorizontalScrollerComponent implements OnChanges {

  @Input() hsc: HTMLElement;
  @Input() offset: number = 300;

  horizontalScroll: number = 0;

  private listenerAdded: boolean;

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.horizontalScroll = this.hsc.scrollLeft;
    if (this.hsc && !this.listenerAdded) {
      this.listenerAdded = true;
      fromEvent(this.hsc, 'scroll').pipe(
        untilDestroyed(this),
        debounceTime(100)
      ).subscribe(() => {
        this.horizontalScroll = this.hsc.scrollLeft;
        this.cdRef.detectChanges();
      });
    }
  }

  scroll(offset: number): void {
    this.hsc.scrollBy({ top: 0, left: offset, behavior: 'smooth' });
  }

}
