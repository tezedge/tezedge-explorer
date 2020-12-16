import {
  Directive, AfterViewInit, DoCheck, OnChanges,
  Input, Output, EventEmitter, ElementRef, ViewContainerRef,
  Renderer2, TemplateRef, SimpleChanges, OnDestroy, NgZone
} from '@angular/core';
import { fromEvent, Subject, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// tslint:disable-next-line: no-conflicting-lifecycle
@Directive({
  selector: '[vsFor][vsForOf]'
})
export class VirtualScrollDirective implements AfterViewInit, OnDestroy, OnChanges, DoCheck {

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

  // private cacheRequestIds = {};
  private cacheRequestStart = 0;
  private cacheRequestEnd = 0;
  private cacheItemsIds = new Set();
  private cacheItemsEntities = {};
  private previousLastCursorId = 0;

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
    if (this.virtualScrollItemsCount > 0) {
      this.renderViewportItems();
    }
  }

  ngDoCheck() {
  }

  ngAfterViewInit() {
    this.initDimensions();
    this.fetchData(true);

    this.ngZone.runOutsideAngular(() => {
      this.scrollListener = this.renderer.listen(this.$viewport, 'scroll', this.onScroll.bind(this));

      this.resizeObservable$ = fromEvent(window, 'resize');
      this.resizeSubscription$ = this.resizeObservable$.pipe(debounceTime(500)).subscribe(event => {
        this.onResize();
      });
    });
  }

  afterReceivingData() {
    this.load();

    if (this.vsForOf.stream || this.previousLastCursorId === 0) {
      this.scrollToBottom();
    }

  }

  scrollToBottom(): void {
    this.previousLastCursorId = this.vsForOf.lastCursorId;
    this.$viewport.scrollTop = (this.virtualScrollItemsCount + 1) * this.itemHeight - this.viewportHeight;
    this.maximumScrollTop = this.$viewport.scrollTop;
    console.log(this.maximumScrollTop);
  }

  onScroll(event) {

    if (this.$viewport.scrollTop > this.maximumScrollTop) {
      this.$viewport.scrollTop = this.maximumScrollTop;
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    // trigger only if user scrolled vertically
    if (this.prevScrollTop !== this.$viewport.scrollTop) {

      // use current scroll position to get start and end item index
      let start = Math.floor((this.$viewport.scrollTop - this.viewportHeight) / this.itemHeight);
      let end = Math.ceil((this.$viewport.scrollTop + (this.viewportHeight * 1.2)) / this.itemHeight);
      start = Math.max(0, start);
      // end = Math.min(this.virtualScrollHeight * 1.2 / this.itemHeight, end);
      end = Math.min(Math.min(this.virtualScrollHeight * 1.2 / this.itemHeight, end), this.vsForOf.lastCursorId);

      // get offset so we can set correct possition for items
      this.virtualScrollItemsOffset = Math.max(this.vsForOf.lastCursorId - this.virtualScrollItemsCount, 0);

      // save scroll position
      this.scrollPositionStart = start;
      this.scrollPositionEnd = end;

      // TODO investigate if this can be moved in some init function - it depends on scrollPositionStart and scrollPositionEnd
      this.createViewElements();

      // if (this.vsForOf.ids.length === 0 ||
      //   (this.virtualScrollItemsOffset + this.scrollPositionEnd) > this.vsForOf.ids[this.vsForOf.ids.length - 1] ||
      //   (this.virtualScrollItemsOffset + this.scrollPositionStart) < this.vsForOf.ids[0]) {
      if (this.vsForOf.ids.length === 0 ||
        (this.virtualScrollItemsOffset + this.scrollPositionEnd) > this.vsForOf.positions[this.vsForOf.ids[this.vsForOf.ids.length - 1]] ||
        (this.virtualScrollItemsOffset + this.scrollPositionStart) < this.vsForOf.positions[this.vsForOf.ids[0]]) {
        this.fetchData();
      } else {
        this.startStopStream();
      }

      this.renderViewportItems();
      this.prevScrollTop = this.$viewport.scrollTop;
    }

  }

  onResize(): void {
    this.initDimensions();
    this.scrollToBottom();
  }

  private initDimensions(): void {

    this.viewContainer.clear();
    this.embeddedViews.length = 0;

    this.maxScrollHeight = this.getMaxBrowserScrollSize();
    this.maxVirtualScrollElements = Math.floor(this.maxScrollHeight / this.itemHeight);

    this.$viewport = this.element.nativeElement.parentElement;
    this.$viewport.style.position = 'relative';
    this.$scroller.style.position = 'absolute';
    this.$scroller.style.top = '0px';
    this.$scroller.style.width = '1px';

    this.renderer.appendChild(this.$viewport, this.$scroller);
    this.viewportHeight = this.$viewport.getBoundingClientRect().height;
  }

  private clear() {
    // console.log('[clear]');

    // clear cache
    // this.cacheRequestIds = {};
    this.cacheItemsIds = new Set();
    this.cacheItemsEntities = {};
    // this.viewContainer.clear();
  }

  private startStopStream(): void {
    const stop = this.maximumScrollTop > this.$viewport.scrollTop;
    const limit = Math.floor(this.viewportHeight / this.itemHeight * 3);

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

      const nextCursorId = reset ? null : Math.min(this.vsForOf.positions[this.virtualScrollItemsOffset + this.scrollPositionEnd + 40] || this.vsForOf.lastCursorId, this.vsForOf.lastCursorId);
      const limit = nextCursorId ? nextCursorId - (this.virtualScrollItemsOffset + this.scrollPositionStart - 40) : Math.floor(this.viewportHeight / this.itemHeight * 3);

      this.getItems.emit({
        nextCursorId,
        limit
      });

    });
  }

  private load() {
    this.clear();

    // set row height in virtual scroll
    // console.log('[load] this.itemHeight=' + this.itemHeight);
    this.itemHeight = 36;

    // get number of items in virtual scroll
    // this.virtualScrollItemsCount = this.maxScrollHeight <= 0 ? this.vsForOf.lastCursorId : (this.vsForOf.lastCursorId * this.itemHeight) > this.maxScrollHeight
    //   ? Math.floor(this.maxScrollHeight / this.itemHeight) : this.vsForOf.lastCursorId;
    this.virtualScrollItemsCount = this.vsForOf.lastCursorId > 0 ?
      Math.min(this.vsForOf.lastCursorId, this.maxVirtualScrollElements) :
      0;

    // set virtual scroll height in pixels
    this.virtualScrollHeight = this.virtualScrollItemsCount * this.itemHeight;
    // this.maxScrollHeight = this.maxScrollHeight > this.virtualScrollHeight || this.maxScrollHeight === 0 ? this.virtualScrollHeight : this.maxScrollHeight;
    this.$scroller.style.height = `${this.virtualScrollHeight}px`;
    // this.$scroller.style.height = `${this.maxScrollHeight}px`;

    // console.log('[load] this.virtualScrollHeight=' + this.virtualScrollHeight + ' this.maxScrollHeight=' + this.maxScrollHeight);

    // this.$viewport.dispatchEvent(new Event('scroll'));
  }

  private renderViewportItems() {
    // this.ngZone.runOutsideAngular(() => {
    // requestAnimationFrame(() => {

    // console.warn('[renderViewportItems] this.vsForOf=', this.vsForOf.ids);
    // console.log('[renderViewportItems]  this.scrollPositionStart=' + this.scrollPositionStart
    //     + ' this.scrollPositionEnd=' + this.scrollPositionEnd);

    // mark current scroll position as cached
    // const requestPositionOffset = this.getRequestPositionOffset();
    // this.cacheRequestIds[requestPositionOffset] = true;

    // loop through embedded views and change their contents
    for (let index = 0; index < this.embeddedViews.length; index++) {
      const virtualScrollPosition = this.virtualScrollItemsOffset + index + this.scrollPositionStart;

      // cache value
      // if (this.vsForOf.entities.hasOwnProperty(virtualScrollPosition) && !this.cacheItemsIds.has(virtualScrollPosition)) {
      //     this.cacheItemsEntities = {
      //         ...this.cacheItemsEntities,
      //         [virtualScrollPosition]: this.vsForOf.entities[virtualScrollPosition],
      //     };
      //     this.cacheItemsIds.add(virtualScrollPosition);
      // }

      // If needed entity not present anywhere
      // if (!this.vsForOf.entities.hasOwnProperty(virtualScrollPosition) && !this.cacheItemsIds.has(virtualScrollPosition)) {
      //     // remove this position from cached positions
      //     const requestPositionOffset = this.getRequestPositionOffset();
      //     delete this.cacheRequestIds[requestPositionOffset];
      // }

      // const view = this.viewContainer.createEmbeddedView(this.template);
      // const view = this.viewContainer.get(index);
      // debugger;
      const idToRender = this.getFirstMatching(this.vsForOf.positions, virtualScrollPosition);

      // change view content
      const view = this.embeddedViews[index];
      view.context.position = (index + this.scrollPositionStart) * this.itemHeight;
      view.context.start = this.scrollPositionStart;
      view.context.end = this.scrollPositionEnd;
      view.context.index = index + this.scrollPositionStart;
      view.context.$implicit = {
        index: virtualScrollPosition,
        ...this.vsForOf.entities[idToRender]
        // ...this.vsForOf.entities[virtualScrollPosition]
        // ...this.cacheItemsEntities[virtualScrollPosition],
      };

      view.markForCheck();
    }

    // schedule change detection to run at the start of the frame.
    requestAnimationFrame(() => {
      this.ngZone.run(() => {
      });
    });

    // })
    // });
  }

  private getFirstMatching(obj, value) {
    let result;
    Object.getOwnPropertyNames(obj).some(key => {
      if (obj[key] === value) {
        result = key;
        return true;
      }
    });
    return result;
  }

  // Renders blank rows while content is loading
  // private renderBlankViewportItems(){

  //     this.ngZone.runOutsideAngular(() => {
  //         // requestAnimationFrame(() => {
  //             console.warn('[renderBlankViewportItems]');
  //             for (let index = 0; index < this.embeddedViews.length; index++) {
  //                 const virtualScrollPosition = this.virtualScrollItemsOffset + index + this.scrollPositionStart;
  //                 // change view content
  //                 const view = this.embeddedViews[index];
  //                 view.context.position = (index + this.scrollPositionStart) * this.itemHeight;
  //                 view.context.start = this.scrollPositionStart;
  //                 view.context.end = this.scrollPositionEnd;
  //                 view.context.index = index + this.scrollPositionStart;
  //                 view.context.$implicit = { index: virtualScrollPosition };
  //                 view.markForCheck();
  //             }
  //         // })
  //     });
  // }

  // get useable scroll size, so we can stack multiple pages for very large list
  // https://stackoverflow.com/questions/34931732/height-limitations-for-browser-vertical-scroll-bar
  private getMaxBrowserScrollSize(): number {

    // return 36000; // just for development purpose return the maximum space that fits only 1000 items

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
      for (let index = 0; index < (this.scrollPositionEnd - this.scrollPositionStart + 10); index++) {
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

  // getRequestPositionOffset(): number {
  //   return Math.round((this.virtualScrollItemsOffset + (this.scrollPositionStart)) / 20) * 20;
  // }

  private reset(): void {
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
  }

  ngOnDestroy(): void {
    this.removeListeners();

    this.reset();

    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
