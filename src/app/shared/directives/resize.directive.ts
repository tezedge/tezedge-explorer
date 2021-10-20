import { Directive, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[resizer]',
  host: {
    '[class.dragging]': 'this.dragExisted'
  },
})
export class ResizeDirective implements OnInit, OnDestroy {

  @Output() resizeFinished = new EventEmitter<number>();

  height: number;
  oldY = 0;
  grabber = false;
  destroy$ = new Subject();

  dragExisted = false;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.calculateHeight();
  }

  public calculateHeight(): void {
    this.height = parseInt(this.el.nativeElement.parentNode.parentNode?.offsetHeight, 10);
  }

  @HostListener('document:mouseup', ['$event'])
  private onMouseUp(): void {
    if (this.dragExisted) {
      this.resizeFinished.emit(this.height);
    }
    this.grabber = false;
    this.dragExisted = false;
    this.destroy$.next(null);
  }

  @HostListener('mousedown', ['$event'])
  private onResize(event: MouseEvent, resizerCallback?: Function): void {
    this.grabber = true;
    this.oldY = event.clientY;
    event.preventDefault();

    this.addMouseMoveListener();
  }

  private resizer(offsetY: number): void {
    this.height += offsetY;
    this.el.nativeElement.parentNode.parentNode.style.height = this.height + 'px';
  }

  private addMouseMoveListener(): void {
    this.dragExisted = true;
    fromEvent(document, 'mousemove')
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.mouseMoveCallback.bind(this));
  }

  private mouseMoveCallback(event: MouseEvent): void {
    if (!this.grabber) {
      return;
    }

    this.resizer(event.clientY - this.oldY);
    this.oldY = event.clientY;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
  }
}
