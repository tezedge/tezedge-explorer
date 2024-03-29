import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { openInTzStats } from '@shared/constants/navigation';

@Component({
  selector: 'app-graph-redirection-overlay',
  templateUrl: './graph-redirection-overlay.component.html',
  styleUrls: ['./graph-redirection-overlay.component.scss']
})
export class GraphRedirectionOverlayComponent implements OnInit {

  @Input() date: string;
  @Input() blockLevel: number;
  @Input() network: string;

  private timestamp: number;

  constructor(private router: Router,
              private elementRef: ElementRef) { }

  ngOnInit(): void {
    const dateFormat = this.date.replace(',', '/' + new Date().getFullYear() + ',');
    this.timestamp = Date.parse(dateFormat);
  }

  isClickOutside(event: Event, parentElement: ElementRef): boolean {
    return !this.elementRef.nativeElement.contains(event.target) && !parentElement.nativeElement.contains(event.target);
  }

  navigate(route: string): void {
    this.router.navigate([route], {
      queryParams: { timestamp: this.timestamp },
      queryParamsHandling: 'merge'
    });
  }

  navigateToExternalURL(): void {
    openInTzStats(this.network, this.blockLevel);
  }
}
