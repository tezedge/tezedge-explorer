import {
  Directive, AfterViewInit, DoCheck, OnChanges,
  Input, Output, EventEmitter, ElementRef, ViewContainerRef,
  Renderer2, TemplateRef, SimpleChanges, OnDestroy, NgZone
} from '@angular/core';
import {fromEvent, Subject, Observable, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

// tslint:disable-next-line: no-conflicting-lifecycle
@Directive({
  selector: '[vsForFromTop][vsForOf]'
})
export class VirtualScrollFromTopDirective implements AfterViewInit, OnDestroy, OnChanges, DoCheck {

  private itemHeight = 36;
  private maxScrollHeight = 0;
  private maxVirtualScrollElements = 0;
  private scrollPositionStart = 0;
  private scrollPositionEnd = 0;

  private embeddedViews = [];

  private virtualScrollHeight = 0;

  private virtualScrollItemsCount = 0;
  private virtualScrollItemsOffset = 0;

  private prevScrollTop = 0;

  private viewportHeight = 0;

  private maximumScrollTop = 0;

  private cacheRequestStart = 0;
  private cacheRequestEnd = 0;
  private previousLastCursorId = 0;
  private elementsBufferUpAndDown = 10;

  private $scroller: HTMLDivElement = document.createElement('div');
  private $viewport: HTMLElement;
  private scrollListener: () => void;

  private resizeObservable$: Observable<Event>;
  private resizeSubscription$: Subscription;

  public onDestroy$ = new Subject();

  @Input() vsForOf: any;

  @Output() getItems = new EventEmitter<any>();

  @Output() startStopDataStream = new EventEmitter<any>();

  constructor(
    private element: ElementRef,
    private viewContainer: ViewContainerRef,
    private renderer: Renderer2,
    private template: TemplateRef<any>,
    private ngZone: NgZone) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.afterReceivingData();
  }

  ngDoCheck() {
  }

  ngAfterViewInit() {
    this.initDimensions();
    // this.fetchData(true);

    this.ngZone.runOutsideAngular(() => {
      this.scrollListener = this.renderer.listen(this.$viewport, 'scroll', this.onScroll.bind(this));

      this.resizeObservable$ = fromEvent(window, 'resize');
      this.resizeSubscription$ = this.resizeObservable$.pipe(debounceTime(500)).subscribe(event => {
        this.onResize();
      });
    });

    // this.afterReceivingData();
  }

  afterReceivingData() {
    if (!this.$viewport) {
      return;
    }
    const newLastCursorIdYN = this.previousLastCursorId !== this.vsForOf.lastCursorId;

    if (newLastCursorIdYN) {
      console.log('previous cursor id:' + this.previousLastCursorId + '| new cursor id: ' + this.vsForOf.lastCursorId);
      this.initDimensions();
    }

    this.load();

    if (this.vsForOf.stream || this.previousLastCursorId === 0) {
      this.scrollToTop();
    }

    this.preparePositionsAndCreateViewElements();
    this.renderViewportItems();
    this.prevScrollTop = this.$viewport.scrollTop;
  }

  scrollToTop(): void {
    if (!this.$viewport) {
      return;
    }
    this.previousLastCursorId = this.vsForOf.lastCursorId;
    // this.$viewport.scrollTop = this.virtualScrollItemsCount * this.itemHeight - this.viewportHeight;
    this.$viewport.scrollTop = 0;
    this.maximumScrollTop = this.virtualScrollItemsCount * this.itemHeight - this.viewportHeight;

  }

  onScroll(event) {
    if (this.$viewport.scrollTop > this.maximumScrollTop) {
      this.$viewport.scrollTop = this.maximumScrollTop;
      this.startStopStream();
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    // trigger only if user scrolled vertically
    if (this.prevScrollTop !== this.$viewport.scrollTop) {
      this.preparePositionsAndCreateViewElements();
      this.startStopStream();

      if (this.getScrollPositionEndWithOffset() > this.vsForOf.ids[this.vsForOf.ids.length - 1] ||
        this.getScrollPositionStartWithOffset() < this.vsForOf.ids[0]) {
        this.fetchData();
      }

      this.renderViewportItems();
      this.prevScrollTop = this.$viewport.scrollTop;
    }

  }

  private preparePositionsAndCreateViewElements() {

    if (!this.$viewport) {
      return;
    }
    // use current scroll position to get start and end item index
    // let start = Math.floor((this.$viewport.scrollTop - this.viewportHeight) / this.itemHeight);
    let start = Math.floor((this.$viewport.scrollTop) / this.itemHeight);
    let end = Math.ceil((this.$viewport.scrollTop + (this.viewportHeight)) / this.itemHeight);
    start = Math.max(0, start);
    // end = Math.min(this.virtualScrollHeight * 1.2 / this.itemHeight, end);
    end = Math.min(Math.min(this.virtualScrollHeight / this.itemHeight, end), this.vsForOf.lastCursorId);

    // save scroll position
    this.scrollPositionStart = start;
    this.scrollPositionEnd = end;

    this.createViewElements();
  }

  onResize(): void {
    this.initDimensions();
    this.scrollToTop();
  }

  private getScrollPositionStartWithOffset(): number {
    return Math.max(this.virtualScrollItemsOffset + this.scrollPositionStart, 0);
  }

  private getScrollPositionEndWithOffset(): number {
    return Math.min(this.virtualScrollItemsOffset + this.scrollPositionEnd, this.vsForOf.lastCursorId);
  }

  private initDimensions(): void {

    this.viewContainer.clear();
    this.embeddedViews.length = 0;

    this.maxScrollHeight = this.getMaxBrowserScrollSize();
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

  private clear() {
    // this.viewContainer.clear();
  }

  private startStopStream(): void {
    const stop = this.maximumScrollTop > this.$viewport.scrollTop;
    const limit = Math.floor(this.viewportHeight / this.itemHeight * 2);

    this.ngZone.run(() => {
      this.startStopDataStream.emit({
        limit,
        stop
      });
    });
  }

  private fetchData(reset: boolean = false): void {
    this.ngZone.run(() => {

      // uncomment for debugging
      // console.log({
      //   cacheRequestStart: this.cacheRequestStart,
      //   cacheRequestEnd: this.cacheRequestEnd,
      //   scrollPositionStart: this.scrollPositionStart,
      //   scrollPositionEnd: this.scrollPositionEnd,
      //   cursor: reset ? null : Math.min(this.virtualScrollItemsOffset + this.scrollPositionEnd + 40, this.vsForOf.lastCursorId),
      //   viewportHeight: this.viewportHeight,
      //   itemsNr: this.virtualScrollItemsCount,
      //   itemsNumberInViewport: Math.floor(this.viewportHeight / this.itemHeight)
      // });

      if (!reset) {
        // cache request position
        this.cacheRequestStart = this.scrollPositionStart;
        this.cacheRequestEnd = this.scrollPositionEnd;
      }

      // check the cursor construction
      // const nextCursorId = reset ?
      //   null :
      //   Math.min(this.vsForOf.idsToPositions[this.virtualScrollItemsOffset + this.scrollPositionEnd + 40] || this.vsForOf.lastCursorId, this.vsForOf.lastCursorId);
      // const limit = nextCursorId ? nextCursorId - (this.getScrollPositionStartWithOffset() - 40) : Math.floor(this.viewportHeight / this.itemHeight * 3);
      const nextCursorId = reset ?
        null :
        Math.max(this.getScrollPositionStartWithOffset() - this.elementsBufferUpAndDown, 0);

      const limit = nextCursorId ?
        (this.getScrollPositionEndWithOffset() + this.elementsBufferUpAndDown) - nextCursorId :
        Math.floor(this.viewportHeight / this.itemHeight * 2);

      this.getItems.emit({
        nextCursorId,
        limit
      });

    });
  }

  private load() {
    // this.clear();
    // get number of items in virtual scroll
    // this.virtualScrollItemsCount = this.maxScrollHeight <= 0 ? this.vsForOf.lastCursorId : (this.vsForOf.lastCursorId * this.itemHeight) > this.maxScrollHeight
    //   ? Math.floor(this.maxScrollHeight / this.itemHeight) : this.vsForOf.lastCursorId;
    this.virtualScrollItemsCount = this.vsForOf.lastCursorId > 0 ?
      Math.min(this.vsForOf.lastCursorId, this.maxVirtualScrollElements) :
      0;

    this.virtualScrollItemsOffset = Math.max(this.vsForOf.lastCursorId - this.virtualScrollItemsCount, 0);

    // set virtual scroll height in pixels
    this.virtualScrollHeight = this.virtualScrollItemsCount * this.itemHeight;
    // this.maxScrollHeight = this.maxScrollHeight > this.virtualScrollHeight || this.maxScrollHeight === 0 ? this.virtualScrollHeight : this.maxScrollHeight;
    this.$scroller.style.height = `${this.virtualScrollHeight}px`;
  }

  private renderViewportItems() {
    for (let index = 0; index < this.embeddedViews.length; index++) {
      // const virtualScrollPosition = this.getScrollPositionStartWithOffset() + index + 1;
      const virtualScrollPosition = this.getScrollPositionStartWithOffset() + index;

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

  // get usable scroll size, so we can stack multiple pages for very large list
  // https://stackoverflow.com/questions/34931732/height-limitations-for-browser-vertical-scroll-bar
  private getMaxBrowserScrollSize(): number {
    if (!this.maxScrollHeight) {

      const div = document.createElement('div');
      const style = div.style;
      style.position = 'absolute';
      style.top = '9999999999999999px';
      document.body.appendChild(div);
      const size = div.getBoundingClientRect().top;
      document.body.removeChild(div);
      return Math.abs(Math.floor(size / 10));

    } else {
      return this.maxScrollHeight;
    }

  }

  private createViewElements(): void {
    if (!this.viewContainer.length) {
      // Initialize viewContainer with all need views (rows)
      // console.warn(`[renderViewportItems] viewContainer init (${this.scrollPositionEnd - this.scrollPositionStart} views)`);
      for (let index = 0; index < (this.scrollPositionEnd - this.scrollPositionStart + 1); index++) {
        const view = this.viewContainer.createEmbeddedView(this.template);
        this.embeddedViews.push(view);
      }
    }
  }

  private removeListeners(): void {
    if (this.scrollListener) {
      this.scrollListener();
    }

    this.resizeSubscription$.unsubscribe();
  }

  private reset(): void {
    console.log('vs reset');
    this.maxScrollHeight = 0;
    this.scrollPositionStart = 0;
    this.scrollPositionEnd = 0;
    this.virtualScrollHeight = 0;

    this.virtualScrollItemsCount = 0;
    this.virtualScrollItemsOffset = 0;

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

    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
