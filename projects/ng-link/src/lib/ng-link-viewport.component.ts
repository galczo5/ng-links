import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter, Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
import {fromEvent} from 'rxjs';
import {NgLinkViewportService} from './ng-link-viewport.service';

@Component({
  selector: 'ng-link-viewport',
  template: `
    <div #viewport class="ng-link-viewport">
      <ng-link-container></ng-link-container>
      <ng-content></ng-content>
    </div>
  `,
  providers: [NgLinkViewportService],
  styles: [`
    :host {
      width: 100%;
      height: 100%;
      display: block;
    }

    .ng-link-viewport {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: auto;
    }
  `]
})
export class NgLinkViewportComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('viewport', { static: true, read: ElementRef })
  viewportElement: ElementRef;

  @Output()
  widthChanged: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  heightChanged: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  topChanged: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  leftChanged: EventEmitter<number> = new EventEmitter<number>();

  private readonly nativeElement: HTMLElement;

  constructor(elementRef: ElementRef,
              private readonly ngZone: NgZone,
              private readonly linkViewportService: NgLinkViewportService) {
    this.nativeElement = elementRef.nativeElement;
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.linkViewportService.init();
      this.onResize();
      this.onScroll();
    });
  }

  ngAfterViewInit() {
    const rect = this.nativeElement.getBoundingClientRect();
    this.linkViewportService.setViewportSize(rect.width, rect.height);

    this.widthChanged.emit(rect.width);
    this.heightChanged.emit(rect.height);

    this.linkViewportService.setViewportPosition(0, 0);

    this.topChanged.emit(0);
    this.leftChanged.emit(0);
  }

  ngOnDestroy() {
    this.linkViewportService.destroy();
  }

  private onScroll(): void {
    const viewport = this.viewportElement.nativeElement as HTMLElement;
    fromEvent(viewport, 'scroll')
      .subscribe(() => {
        this.linkViewportService.setViewportPosition(viewport.scrollTop, viewport.scrollLeft);
        this.topChanged.emit(viewport.scrollTop);
        this.leftChanged.emit(viewport.scrollLeft);
      });
  }

  private onResize(): void {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const contentRect = entry.contentRect;
        this.linkViewportService.setViewportSize(contentRect.width, contentRect.height);
        this.widthChanged.emit(contentRect.width);
        this.heightChanged.emit(contentRect.height);
      }
    });

    resizeObserver.observe(this.nativeElement);
  }

}
