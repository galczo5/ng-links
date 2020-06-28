import {Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NgLink, NgLinkType} from '../../../projects/ng-link/src/lib/ng-link';
import {NgLinkRepositoryService} from '../../../projects/ng-link/src/lib/ng-link-repository.service';
import {animationFrameScheduler, fromEvent} from 'rxjs';
import {switchMap, takeUntil, throttleTime} from 'rxjs/operators';

@Component({
  selector: 'app-test-endpoint',
  template: `
    <button #button class="btn btn-info d-flex justify-content-between align-items-center"
            [style.width.px]="width"
            [style.height.px]="height"
            style="position: absolute; top: 0; left: 0; will-change: transform;">
      <ng-container *ngIf="start">START</ng-container>
      <ng-container *ngIf="end">END</ng-container>
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
    this.setPosition(this.x, this.y);
  }

  private dragAndDrop(): void {
    fromEvent(this.button.nativeElement, 'mousedown')
      .pipe(
        switchMap(() => {
          return fromEvent(document, 'mousemove')
            .pipe(
              throttleTime(0, animationFrameScheduler),
              takeUntil(fromEvent(document, 'mouseup'))
            );
        })
      )
      .subscribe((event: MouseEvent) => {
        const scrollTop = window.pageYOffset;
        this.setPosition(event.clientX, event.clientY + scrollTop);
        this.updateLink(event.clientX, event.clientY + scrollTop);
      });
  }

  private setPosition(x: number, y: number): void {
    const el = this.button.nativeElement;
    this.renderer.setStyle(el, 'transform', `translateY(${y}px) translateX(${x}px)`);
  }

  // Ugly, but its only a demo
  private updateLink(newX: number, newY: number): void {
    const halfOfHeight = this.height / 2;

    const y = newY + halfOfHeight;
    const endOfBlock = newX + this.width;

    if (this.link.type === NgLinkType.ES) {
      this.updateES(endOfBlock, y, newX);
    } else if (this.link.type === NgLinkType.SE) {
      this.updateSE(newX, y, endOfBlock);
    } else if (this.link.type === NgLinkType.EE) {
      this.updateEE(endOfBlock, y);
    } else if (this.link.type === NgLinkType.SS) {
      this.updateSS(newX, y);
    }
  }

  private updateSS(newX: number, y: number) {
    if (this.start) {
      this.linkRepositoryService.updateLink([{
        ...this.link,
        start: {
          x: newX,
          y
        }
      }]);
    } else if (this.end) {
      this.linkRepositoryService.updateLink([{
        ...this.link,
        end: {
          x: newX,
          y
        }
      }]);
    }
  }

  private updateEE(endOfBlock: number, y: number) {
    if (this.start) {
      this.linkRepositoryService.updateLink([{
        ...this.link,
        start: {
          x: endOfBlock,
          y
        }
      }]);
    } else if (this.end) {
      this.linkRepositoryService.updateLink([{
        ...this.link,
        end: {
          x: endOfBlock,
          y
        }
      }]);
    }
  }

  private updateSE(newX: number, y: number, endOfBlock: number) {
    if (this.start) {
      this.linkRepositoryService.updateLink([{
        ...this.link,
        start: {
          x: newX,
          y
        }
      }]);
    } else if (this.end) {
      this.linkRepositoryService.updateLink([{
        ...this.link,
        end: {
          x: endOfBlock,
          y
        }
      }]);
    }
  }

  private updateES(endOfBlock: number, y: number, newX: number) {
    if (this.start) {
      this.linkRepositoryService.updateLink([{
        ...this.link,
        start: {
          x: endOfBlock,
          y
        }
      }]);
    } else if (this.end) {
      this.linkRepositoryService.updateLink([{
        ...this.link,
        end: {
          x: newX,
          y
        }
      }]);
    }
  }
}
