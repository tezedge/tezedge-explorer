import {
  Directive, AfterViewInit, OnChanges,
  Input, Output, EventEmitter, ElementRef, ViewContainerRef,
  Renderer2, TemplateRef, SimpleChanges, OnDestroy, NgZone
} from '@angular/core';
import { fromEvent, Subject, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export const VIRTUAL_SCROLL_OFFSET_SCROLL_ELEMENTS = 5;

@Directive({
  selector: '[vsFor][vsForOf]'
})
export class VirtualScrollDirective implements AfterViewInit, OnDestroy, OnChanges {

  private itemHeight = 36;
  private maxScrollHeight = 0;
  private maxVirtualScrollElements = 0;
  private scrollPositionStart = 0;
  private scrollPositionEnd = 0;

  private embeddedViews = [];

  private virtualScrollHeight = 0;

  private virtualScrollItemsCount = 0;

  private prevScrollTop = 0;

  private viewportHeight = 0;

  private maximumScrollTop = 0;

  private previousLastCursorId = 0;

  private offsetScrollElements = VIRTUAL_SCROLL_OFFSET_SCROLL_ELEMENTS;

  private $scroller: HTMLDivElement = document.createElement('div');
  private $viewport: HTMLElement;
  private scrollListener: () => void;

  private resizeObservable$: Observable<Event>;
  private resizeSubscription$: Subscription;

  private onDestroy$ = new Subject();

  @Input() vsForOf: any;
  @Input() initialSelectedIndex: number;

  @Output() getItems = new EventEmitter<any>();

  @Output() startStopDataStream = new EventEmitter<any>();

  constructor(
    private element: ElementRef,
    private viewContainer: ViewContainerRef,
    private renderer: Renderer2,
    private template: TemplateRef<any>,
    private ngZone: NgZone) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const sameInitialSelectedIndex = changes.initialSelectedIndex === undefined || changes.initialSelectedIndex.currentValue === changes.initialSelectedIndex.previousValue;
    if (changes.vsForOf.previousValue !== undefined && this.isEquivalent(changes.vsForOf.currentValue.entities, changes.vsForOf.previousValue.entities)
      && sameInitialSelectedIndex) {
      return;
    }
    this.afterReceivingData();
  }

  ngAfterViewInit(): void {
    this.initDimensions();

    this.ngZone.runOutsideAngular(() => {
      this.scrollListener = this.renderer.listen(this.$viewport, 'scroll', this.onScroll.bind(this));

      this.resizeObservable$ = fromEvent(window, 'resize');
      this.resizeSubscription$ = this.resizeObservable$.pipe(debounceTime(500)).subscribe(this.onResize);
    });
  }

  private afterReceivingData(): void {
    if (!this.$viewport) {
      return;
    }

    const newLastCursorIdYN = this.previousLastCursorId !== this.vsForOf.lastCursorId;

    if (newLastCursorIdYN) {
      this.initDimensions();
    }

    this.load();

    // if (this.vsForOf.stream || this.previousLastCursorId === 0) {

    this.scrollToBottom();
    // }

    this.preparePositionsAndCreateViewElements();
    this.renderViewportItems();
    if (this.initialSelectedIndex !== undefined) { // force scroll to specific element index
      if (Math.floor(this.viewportHeight / this.itemHeight) / 2 >= this.initialSelectedIndex) {
        this.$viewport.scrollTop = 0;
      } else {
        this.$viewport.scrollTop = this.initialSelectedIndex * this.itemHeight - (this.viewportHeight / 2);
      }
    }
    this.prevScrollTop = this.$viewport.scrollTop;
  }

  private scrollToBottom(): void {
    if (!this.$viewport) {
      return;
    }
    this.previousLastCursorId = this.vsForOf.lastCursorId;
    this.$viewport.scrollTop = this.virtualScrollItemsCount * this.itemHeight - this.viewportHeight;
    this.maximumScrollTop = this.$viewport.scrollTop;
  }

  private onScroll(event): void {
    if (this.$viewport.scrollTop > this.maximumScrollTop) {
      this.$viewport.scrollTop = this.maximumScrollTop;
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    if (this.$viewport.scrollTop !== this.maximumScrollTop && this.vsForOf.stream) {
      this.startStopStream();
    }

    // trigger only if user scrolled vertically
    // if (this.prevScrollTop !== this.$viewport.scrollTop) {
    this.preparePositionsAndCreateViewElements();

    this.renderViewportItems();
    this.prevScrollTop = this.$viewport.scrollTop;
    // }
  }

  private preparePositionsAndCreateViewElements(): void {

    if (!this.$viewport) {
      return;
    }
    // use current scroll position to get start and end item index
    // let start = Math.floor((this.$viewport.scrollTop - this.viewportHeight) / this.itemHeight);
    // let end = Math.ceil((this.$viewport.scrollTop + this.viewportHeight) / this.itemHeight);
    // start = Math.max(0, start);
    // end = Math.min(Math.min(this.virtualScrollHeight / this.itemHeight, end), this.vsForOf.lastCursorId - this.virtualScrollItemsOffset + 1);

    // const start = Math.floor((this.vsForOf.lastCursorId - 1) - (this.viewportHeight / this.itemHeight));
    // const end = start + Math.ceil(this.viewportHeight / this.itemHeight);

    const firstDisplayed = Math.floor(this.$viewport.scrollTop / this.itemHeight);
    const start = Math.max(firstDisplayed - this.offsetScrollElements, 0);

    const lastDisplayed = firstDisplayed + Math.ceil(this.viewportHeight / this.itemHeight);
    const end = Math.min(lastDisplayed, 1000);

    // save scroll position
    this.scrollPositionStart = start;
    this.scrollPositionEnd = end;

    this.createViewElements();
  }

  public onResize(): void {
    if (!this) {
      return;
    }
    this.initDimensions();
    this.load();
    this.scrollToBottom();
    this.preparePositionsAndCreateViewElements();
    this.renderViewportItems();
  }

  private initDimensions(): void {

    this.viewContainer.clear();
    this.embeddedViews.length = 0;

    // this.maxScrollHeight = this.getMaxBrowserScrollSize();
    this.maxScrollHeight = 1000 * this.itemHeight;
    this.maxVirtualScrollElements = Math.floor(this.maxScrollHeight / this.itemHeight);

    this.$viewport = null;

    this.$viewport = this.element.nativeElement.parentElement;
    this.$viewport.style.position = 'relative';
    this.$scroller.style.position = 'absolute';
    this.$scroller.style.top = '0px';
    this.$scroller.style.width = '1px';

    this.renderer.appendChild(this.$viewport, this.$scroller);
    this.viewportHeight = this.$viewport.getBoundingClientRect().height;
  }

  private startStopStream(): void {
    const stop = true;
    const limit = 1000;

    this.ngZone.run(() => {
      this.startStopDataStream.emit({
        limit,
        stop
      });
    });
  }

  private load(): void {
    this.virtualScrollItemsCount = this.vsForOf.lastCursorId > 0 ?
      Math.min(this.vsForOf.lastCursorId + 1, this.maxVirtualScrollElements) :
      0;

    // set virtual scroll height in pixels
    this.virtualScrollHeight = this.virtualScrollItemsCount * this.itemHeight;
    // this.maxScrollHeight = this.maxScrollHeight > this.virtualScrollHeight || this.maxScrollHeight === 0 ? this.virtualScrollHeight : this.maxScrollHeight;
    this.$scroller.style.height = `${this.virtualScrollHeight}px`;
  }

  private renderViewportItems(): void {
    for (let index = 0; index < this.embeddedViews.length; index++) {
      const virtualScrollPosition = this.scrollPositionStart + index;

      // change view content
      const view = this.embeddedViews[index];
      view.context.position = (index + this.scrollPositionStart) * this.itemHeight;
      view.context.start = this.scrollPositionStart;
      view.context.end = this.scrollPositionEnd;
      view.context.index = index + this.scrollPositionStart;
      view.context.$implicit = {
        index: virtualScrollPosition,
        ...this.vsForOf.entities[virtualScrollPosition]
      };

      view.markForCheck();
    }

    // schedule change detection to run at the start of the frame.
    requestAnimationFrame(() => {
      this.ngZone.run(() => {
      });
    });
  }

  private createViewElements(): void {
    if (!this.viewContainer.length) {
      const numberOfElements = (this.scrollPositionEnd - this.scrollPositionStart) + 1;
      // Initialize viewContainer with all need views (rows)
      // console.warn(`[renderViewportItems] viewContainer init (${this.scrollPositionEnd - this.scrollPositionStart} views)`);
      for (let index = 0; index < numberOfElements; index++) {
        const view = this.viewContainer.createEmbeddedView(this.template);
        this.embeddedViews.push(view);
      }
    }
  }

  private isEquivalent(a, b): boolean {
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    if (aProps.length !== bProps.length) {
      return false;
    }

    for (const propName of aProps) {
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  }

  private removeListeners(): void {
    if (this.scrollListener) {
      this.scrollListener();
    }

    if (this.resizeSubscription$) {
      this.resizeSubscription$.unsubscribe();
    }
  }

  private reset(): void {
    this.maxScrollHeight = 0;
    this.scrollPositionStart = 0;
    this.scrollPositionEnd = 0;
    this.virtualScrollHeight = 0;

    this.virtualScrollItemsCount = 0;

    this.prevScrollTop = 0;
    this.viewportHeight = 0;
    this.maximumScrollTop = 0;

    this.previousLastCursorId = 0;

    this.viewContainer.clear();
    this.embeddedViews.length = 0;
  }

  ngOnDestroy(): void {
    this.removeListeners();

    this.reset();

    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }
}
