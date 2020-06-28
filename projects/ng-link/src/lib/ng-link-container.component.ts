import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {NgLink} from './ng-link';
import {NgLinkEndpointService} from './ng-link-endpoint.service';
import {NgViewportRepositoryService} from './ng-viewport-repository.service';

type UpdateProps = { width?: number, dashed?: boolean, color?: string };

@Component({
  selector: 'ng-link-container',
  template: `
    <svg style="overflow: visible;" #linkContainer>
      <path *ngFor="let link of links; trackBy: trackByFn;"
            [id]="link.id"
            class="ng-link"/>
    </svg>
  `,
  styles: [`
    :host {
      position: absolute;
      top: 0;
      left: 0;
    }
  `]
})
export class NgLinkContainerComponent implements OnInit {

  @ViewChild('linkContainer', { static: true, read: ElementRef })
  linkContainer: ElementRef;

  links: Array<NgLink> = [];

  private linksElements: Map<string, HTMLElement> = new Map<string, HTMLElement>();
  private linksMap: Map<string, NgLink> = new Map<string, NgLink>();

  constructor(private readonly linkRepositoryService: NgViewportRepositoryService,
              private readonly linkEndpointService: NgLinkEndpointService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.onLinksAdded();
    this.onLinksDeleted();
    this.onLinksUpdated();
  }

  private onLinksUpdated(): void {
    this.linkRepositoryService.selectLinksUpdated()
      .subscribe(links => {
        for (const updateRequest of links) {
          const id = updateRequest.id;
          const originalLink = this.linksMap.get(id);

          this.linksMap.set(id, updateRequest);
          const props = this.getUpdateProps(originalLink, updateRequest);
          this.updateLinkProperties(id, props);
        }
      });
  }

  private onLinksDeleted(): void {
    this.linkRepositoryService.selectLinksDeleted()
      .subscribe(ids => {
        this.links = this.links.filter(l => ids.indexOf(l.id) === -1);
        this.changeDetectorRef.detectChanges();
      });
  }

  private onLinksAdded(): void {
    this.linkRepositoryService.selectLinksAdded()
      .subscribe(links => {
        this.setLinks(links);
        this.changeDetectorRef.detectChanges();
        this.setLinkElements();
      });
  }

  private setLinks(links: Array<NgLink>): void {
    this.links.push(...links);
    for (const link of links) {
      this.linksMap.set(link.id, link);
    }
  }

  private getUpdateProps(originalLink: NgLink, updatedLink: NgLink): UpdateProps {
    const props: UpdateProps = {};

    if (originalLink.style.color !== updatedLink.style.color) {
      props.color = updatedLink.style.color;
    }

    if (originalLink.style.width !== updatedLink.style.width) {
      props.width = updatedLink.style.width;
    }

    if (originalLink.style.dashed !== updatedLink.style.dashed) {
      props.dashed = updatedLink.style.dashed;
    }
    return props;
  }

  private setLinkElements(): void {
    const containerElement = this.linkContainer.nativeElement as HTMLElement;
    const childNodes = Array.from(containerElement.childNodes);
    for (const childNode of childNodes) {
      const childNodeElement = childNode as HTMLElement;
      const id = childNodeElement.id;

      if (!id) {
        continue;
      }

      this.linksElements.set(id, childNodeElement);
      this.setLinkProperties(id);
    }
  }

  private setLinkProperties(id: string): void {
    const link = this.linksMap.get(id);
    const childNodeElement = this.linksElements.get(id);
    const style = link.style;

    this.renderer.setStyle(childNodeElement, 'stroke-width', style ? style.width : 2);
    this.renderer.setStyle(childNodeElement, 'stroke-dasharray', style && style.dashed ? 2 : 0);
    this.renderer.setStyle(childNodeElement, 'stroke', style ? style.color : 'gray');
    this.renderer.setStyle(childNodeElement, 'fill', style ? style.color : 'gray');

    this.setD(link, childNodeElement);
  }

  private updateLinkProperties(id: string, props: UpdateProps): void {
    const childNodeElement = this.linksElements.get(id);

    if (props.width !== undefined) {
      this.renderer.setStyle(childNodeElement, 'stroke-width', props.width);
    }

    if (props.dashed !== undefined) {
      this.renderer.setStyle(childNodeElement, 'stroke-dasharray', props.dashed);
    }

    if (props.color !== undefined) {
      this.renderer.setStyle(childNodeElement, 'stroke', props.color);
      this.renderer.setStyle(childNodeElement, 'fill', props.color);
    }

    const link = this.linksMap.get(id);
    this.setD(link, childNodeElement);
  }

  private setD(link: NgLink, childNodeElement: HTMLElement): void {
    const d = this.linkEndpointService.getD(link);
    this.renderer.setStyle(childNodeElement, 'd', `path("${d}")`);
  }

  trackByFn(index: number, link: NgLink): string {
    return link.id;
  }

}
