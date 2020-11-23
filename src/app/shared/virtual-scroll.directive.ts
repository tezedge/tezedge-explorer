import {
  Directive, AfterViewInit, DoCheck, OnChanges, ViewRef,
  Input, Output, EventEmitter, ElementRef, ViewContainerRef,
  Renderer2, TemplateRef, SimpleChanges, OnDestroy
} from '@angular/core';
import { of, fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

// tslint:disable-next-line: no-conflicting-lifecycle
@Directive({
  selector: '[vsFor][vsForOf]'
})
export class VirtualScrollDirective implements AfterViewInit, OnDestroy, OnChanges {

  private displayHistory = {};
  private currentPage = 1;
  private lastRequestCursor: number = null;

  private itemHeight = 36;
  private maxScrollHeight = 0;
  private scrollPositionStart = 0;
  private scrollPositionEnd = 0;

  private virtualScrollHeight = 0;

  private virtualScrollItemsCount = 0;
  private virtualScrollItemsOffset = 0;

  private viewportHeight = 0;

  private cacheRequestIds = {};
  private cacheItemsIds = new Set();
  private cacheItemsEntities = {};

  private $scroller: HTMLDivElement = document.createElement('div');
  private $viewport: HTMLElement;
  private scrollListener: () => void;

  @Input() vsForOf: any;

  @Output() getItems = new EventEmitter<any>();

  constructor(
    private element: ElementRef,
    private viewContainer: ViewContainerRef,
    private renderer: Renderer2,
    private template: TemplateRef<any>) {
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('[ngOnChanges]', changes);
    // if (this.virtualScrollItemsCount > 0) {
    //   // render items
    //   this.viewContainer.clear();
    //   this.renderViewportItems();
    // }

  }

  ngAfterViewInit() {
    // console.log('[ngAfterViewInit]');

    this.maxScrollHeight = this.getMaxBrowserScrollSize();

    this.$viewport = this.element.nativeElement.parentElement;
    this.$viewport.style.position = 'relative';
    this.$scroller.style.position = 'absolute';
    this.$scroller.style.top = '0px';
    this.$scroller.style.width = '1px';

    this.renderer.appendChild(this.$viewport, this.$scroller);

    this.viewportHeight = this.$viewport.getBoundingClientRect().height;
    this.scrollListener = this.renderer.listen(this.$viewport, 'scroll', this.onScroll.bind(this));
    // console.log('[ngAfterViewInit] this.maxScrollHeight=' + this.maxScrollHeight + ' this.viewportHeight=' + this.viewportHeight);
  }

  scrollToBottom() {

    if (!this.vsForOf.ids.length) {
      this.clear();
      return;
    }

    this.updateDisplayHistory();

    // load all virtual scroll date
    this.load();
    this.drawNewItems();

    console.log('[scrollToBottom] this.virtualScrollItemsCount=' + this.virtualScrollItemsCount);

    // set scroll to latest item in list
    // this.$viewport.scrollTop = this.virtualScrollItemsCount * this.itemHeight;

  }

  onScroll() {
    // update virtual scroll before next repaint
    window.requestAnimationFrame(() => {
      this.drawNewItems();

      // // use current scroll position to get start and end item index
      // let start = Math.floor((this.$viewport.scrollTop - this.viewportHeight) / this.itemHeight);
      // let end = Math.ceil((this.$viewport.scrollTop + (this.viewportHeight * 2)) / this.itemHeight);
      // start = Math.max(0, start);
      // end = Math.min(this.virtualScrollHeight / this.itemHeight, end);
      // console.warn('[onScroll] start=' + start + ' end=' + end
      //   + ' this.scrollPositionStart=' + this.scrollPositionStart + ' this.scrollPositionEnd=' + this.scrollPositionEnd);
      //
      // // get offset so we can set correct position for items
      // this.virtualScrollItemsOffset = (this.getCursorId() - this.virtualScrollItemsCount);
      // console.log('[onScroll] this.virtualScrollItemsCount=' + this.virtualScrollItemsCount
      //   + ' lastCursorId=' + this.getCursorId());
      //
      // this.scrollPositionStart = start;
      // this.scrollPositionEnd = end;
      //
      // // emit event to load data for virtual scroll
      // this.fetchNewData();
      //
      // this.viewContainer.clear();
      // this.renderViewportItems();
    });
  }

  private drawNewItems() {
    // use current scroll position to get start and end item index
    let start = Math.floor((this.$viewport.scrollTop - this.viewportHeight) / this.itemHeight);
    let end = Math.ceil((this.$viewport.scrollTop + (this.viewportHeight * 2)) / this.itemHeight);
    start = Math.max(0, start);
    end = Math.min(this.virtualScrollHeight / this.itemHeight, end);
    console.warn('[onScroll] start=' + start + ' end=' + end
      + ' this.scrollPositionStart=' + this.scrollPositionStart + ' this.scrollPositionEnd=' + this.scrollPositionEnd);

    // get offset so we can set correct position for items
    this.virtualScrollItemsOffset = this.getRenderedItemsNumber() - this.virtualScrollItemsCount;

    this.scrollPositionStart = start;
    this.scrollPositionEnd = end;

    // emit event to load data for virtual scroll
    // this.fetchNewData();

    this.viewContainer.clear();
    this.renderViewportItems();
  }

  private fetchNewData() {
    if (this.lastRequestCursor !== this.virtualScrollItemsOffset + this.scrollPositionEnd) {
      this.lastRequestCursor = this.getCursorId();
      this.currentPage++;

      this.getItems.emit({
        start: this.virtualScrollItemsOffset + this.scrollPositionStart,
        end: this.virtualScrollItemsOffset + this.scrollPositionEnd,
        cursorId: this.lastRequestCursor
      });
    }

  }

  private updateDisplayHistory() {
    this.displayHistory[this.currentPage] = {
      page: this.currentPage,
      requestCursor: this.lastRequestCursor,
      firstId: this.vsForOf.ids[0],
      lastId: this.vsForOf.ids[this.vsForOf.ids.length - 1],
      nrOfItems: this.vsForOf.ids.length
    };
  }

  private clear() {
    this.viewContainer.clear();
  }

  private load() {

    this.clear();
    this.itemHeight = 36;

    // get number of items in virtual scroll
    console.warn('[load] lastCursorId=', this.getCursorId());
    // this.virtualScrollItemsCount = (this.getCursorId() * this.itemHeight) > this.maxScrollHeight
    //   ? Math.floor(this.maxScrollHeight / this.itemHeight) : this.getCursorId() || 0;

    this.virtualScrollItemsCount = this.getRenderedItemsNumber();

    // set virtual scroll height in pixels
    this.virtualScrollHeight = this.virtualScrollItemsCount * this.itemHeight;
    this.maxScrollHeight = this.maxScrollHeight > this.virtualScrollHeight ? this.virtualScrollHeight : this.maxScrollHeight;
    this.$scroller.style.height = `${this.maxScrollHeight}px`;
  }

  private getRenderedItemsNumber(): number {
    const pages = Object.keys(this.displayHistory);
    let sum = 0;

    if (!pages.length) {
      return sum;
    }

    for (const item of pages) {
      sum += this.displayHistory[item].nrOfItems;
    }

    return sum;
  }

  private renderViewportItems(): void {
    // this.virtualScrollItemsOffset = (this.getCursorId() - this.virtualScrollItemsCount);

    console.warn('[renderViewportItems] this.vsForOf=', this.vsForOf.ids);
    console.warn('[renderViewportItems]  this.scrollPositionStart=' + this.scrollPositionStart
      + ' this.scrollPositionEnd=' + this.scrollPositionEnd);

    // prepare items for render
    for (let index = 0; index < (this.scrollPositionEnd - this.scrollPositionStart); index++) {

      const virtualScrollPosition = this.virtualScrollItemsOffset + index + this.scrollPositionStart;

      console.log('[renderViewportItems]', virtualScrollPosition, this.getElementToRender(virtualScrollPosition));

      const view = this.viewContainer.createEmbeddedView(this.template);
      view.context.position = (index + this.scrollPositionStart) * this.itemHeight;
      view.context.$implicit = {
        index: virtualScrollPosition,
        ...this.getElementToRender(virtualScrollPosition)
      };
      view.context.start = this.scrollPositionStart;
      view.context.end = this.scrollPositionEnd;
      view.context.index = index + this.scrollPositionStart;

      view.markForCheck();
    }

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

  private getCursorId(): number {
    return this.vsForOf.lastCursorId || this.vsForOf.ids[this.vsForOf.ids.length - 1];
  }

  private getElementToRender(position) {
    return this.vsForOf.entities[position];
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      this.scrollListener();
    }
  }
}
