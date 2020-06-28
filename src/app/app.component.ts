import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {NgLinkRepositoryService} from '../../projects/ng-link/src/lib/ng-link-repository.service';
import {NgLink, NgLinkEndpoint, NgLinkType} from '../../projects/ng-link/src/lib/ng-link';
import {Subject} from 'rxjs';
import {auditTime, debounceTime} from 'rxjs/operators';

const style = {
  color: 'darkgray',
  width: 2
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {

  static ITERATOR = 2;

  links: Array<NgLink> = [];
  visibleEndpoints: Array<NgLink> = [];
  linkTypes = [NgLinkType.ES, NgLinkType.SE, NgLinkType.SS, NgLinkType.EE];

  buttonWidth = 120;
  buttonHeight = 32;

  count = 0;
  hideEndpoints = false;

  height = 0;

  private viewportTop = 0;
  private viewportLeft = 0;
  private viewportHeight = 0;
  private viewportWidth = 0;

  private viewportChange$: Subject<void> = new Subject<void>();

  constructor(private readonly linkRepositoryService: NgLinkRepositoryService,
              private readonly changeDetectorRef: ChangeDetectorRef) {
    const urlParams = new URLSearchParams(window.location.search);
    this.count = +urlParams.get('count') || 4;
    this.hideEndpoints = urlParams.get('noEndpoints') === 'true';
  }

  ngAfterViewInit() {
    this.generateItems();

    this.height = AppComponent.ITERATOR * 100;

    this.changeDetectorRef.detectChanges();

    this.viewportChange$
      .pipe(debounceTime(50))
      .subscribe(() => {
        this.visibleEndpoints = this.links.filter(link => {
          return this.isEndpointVisible(link.start) || this.isEndpointVisible(link.end);
        });
        this.changeDetectorRef.detectChanges();
      });
  }

  getButtonEndX(link: NgLink): number {
    if (link.type === NgLinkType.ES || link.type === NgLinkType.SS) {
      return link.end.x;
    } else {
      return link.end.x - this.buttonWidth;
    }
  }

  isEndpointVisible(endpoint: NgLinkEndpoint): boolean {
    const viewportMargin = 300;
    return endpoint.y + viewportMargin > this.viewportTop &&
      endpoint.y - viewportMargin < this.viewportTop + this.viewportHeight &&
      endpoint.x + viewportMargin > this.viewportLeft &&
      endpoint.x - viewportMargin < this.viewportLeft + this.viewportWidth;
  }

  setViewportHeight($event: number): void {
    this.viewportHeight = $event;
    this.viewportChange$.next();
  }

  setViewportWidth($event: number): void {
    this.viewportWidth = $event;
    this.viewportChange$.next();
  }

  setViewportLeft($event: number): void {
    this.viewportLeft = $event;
    this.viewportChange$.next();
  }

  setViewportTop($event: number): void {
    this.viewportTop = $event;
    this.viewportChange$.next();
  }

  private generateItems(): void {
    const generationStart = performance.now();
    for (let i = 0; i < this.count; i++) {
      this.generateLink();
    }
    const generationEnd = performance.now();
    console.info(`${this.count} LINKS GENERATED IN`, generationEnd - generationStart, 'ms');

    const linksAddStart = performance.now();
    this.linkRepositoryService.addLinks(this.links);
    const linksAddEnd = performance.now();
    console.info(`${this.count} LINKS ADDED IN`, linksAddEnd - linksAddStart, 'ms');
  }

  private generateLink(): void {
    const id = (AppComponent.ITERATOR - 1).toString();
    const mod = AppComponent.ITERATOR % 2;

    const x = mod ? 700 : 100;
    const y = (AppComponent.ITERATOR - mod) * 100;

    const start = {x, y};
    const end = {x: x + 300, y: y + 100};
    const type = this.linkTypes[AppComponent.ITERATOR % 4];

    this.links.push({id, type, start, end, style});
    AppComponent.ITERATOR++;
  }

}
