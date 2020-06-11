import {AfterViewInit, Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NgLink, NgLinkType} from '../../../projects/ng-link/src/lib/ng-link';
import {NgLinkRepositoryService} from '../../../projects/ng-link/src/lib/ng-link-repository.service';
import {fromEvent} from 'rxjs';
import {switchMap, takeUntil, throttleTime} from 'rxjs/operators';

@Component({
  selector: 'app-test-endpoint',
  template: `
    <button #button class="btn btn-info d-flex justify-content-between align-items-center"
            [style.top.px]="y"
            [style.left.px]="x"
            [style.width.px]="width"
            [style.height.px]="height"
            style="position: absolute;">
      <ng-content></ng-content>
    </button>
  `
})
export class TestEndpointComponent implements OnInit {

  @ViewChild('button', { static: true, read: ElementRef })
  button: ElementRef;

  @Input()
  x: number;

  @Input()
  y: number;

  @Input()
  link: NgLink;

  @Input()
  end = false;

  @Input()
  start = false;

  @Input()
  width = 120;

  @Input()
  height = 32;

  constructor(private readonly linkRepositoryService: NgLinkRepositoryService,
              private readonly renderer: Renderer2,
              private readonly ngZone: NgZone) {
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => this.dragAndDrop());
  }

  private dragAndDrop(): void {
    fromEvent(this.button.nativeElement, 'mousedown')
      .pipe(
        switchMap(() => {
          return fromEvent(document, 'mousemove')
            .pipe(
              throttleTime(20),
              takeUntil(fromEvent(document, 'mouseup'))
            );
        })
      )
      .subscribe((event: MouseEvent) => {
        this.setPosition(event.clientX, event.clientY);
        this.updateLink(event.clientX, event.clientY);
      });
  }

  private setPosition(x: number, y: number): void {
    const el = this.button.nativeElement;
    this.renderer.setStyle(el, 'top', y + 'px');
    this.renderer.setStyle(el, 'left', x + 'px');
  }

  // Ugly, but its only a demo
  private updateLink(newX: number, newY: number): void {
    const halfOfHeight = this.height / 2;
    const y = newY + halfOfHeight;

    const endOfBlock = newX + this.width;

    if (this.link.type === NgLinkType.ES) {
      if (this.start) {
        this.linkRepositoryService.updateLink([{
          id: this.link.id,
          link: {start: {x: endOfBlock, y}}
        }]);
      } else if (this.end) {
        this.linkRepositoryService.updateLink([{
          id: this.link.id,
          link: {end: {x: newX, y}}
        }]);
      }
    } else if (this.link.type === NgLinkType.SE) {
      if (this.start) {
        this.linkRepositoryService.updateLink([{
          id: this.link.id,
          link: {start: {x: newX, y}}
        }]);
      } else if (this.end) {
        this.linkRepositoryService.updateLink([{
          id: this.link.id,
          link: {end: {x: endOfBlock, y}}
        }]);
      }
    } else if (this.link.type === NgLinkType.EE) {
      if (this.start) {
        this.linkRepositoryService.updateLink([{
          id: this.link.id,
          link: {start: {x: endOfBlock, y}}
        }]);
      } else if (this.end) {
        this.linkRepositoryService.updateLink([{
          id: this.link.id,
          link: {end: {x: endOfBlock, y}}
        }]);
      }
    } else if (this.link.type === NgLinkType.SS) {
      if (this.start) {
        this.linkRepositoryService.updateLink([{
          id: this.link.id,
          link: {start: {x: newX, y}}
        }]);
      } else if (this.end) {
        this.linkRepositoryService.updateLink([{
          id: this.link.id,
          link: {end: {x: newX, y}}
        }]);
      }
    }
  }
}
