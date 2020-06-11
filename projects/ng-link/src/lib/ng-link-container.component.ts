import {ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NgLinkRepositoryService} from './ng-link-repository.service';
import {NgLink} from './ng-link';
import {NgLinkEndpointService} from './ng-link-endpoint.service';

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

  constructor(private readonly linkRepositoryService: NgLinkRepositoryService,
              private readonly linkEndpointService: NgLinkEndpointService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.linkRepositoryService.selectLinksAdded()
      .subscribe(links => {
        this.setLinks(links);
        this.changeDetectorRef.detectChanges();
        this.setLinkElements();
      });

    this.linkRepositoryService.selectLinksDeleted()
      .subscribe(ids => {
        this.links = this.links.filter(l => ids.indexOf(l.id) === -1);
        this.changeDetectorRef.detectChanges();
      });

    this.linkRepositoryService.selectLinksUpdated()
      .subscribe(links => {
        for (const updateRequest of links) {
          const id = updateRequest.id;
          const originalLink = this.linksMap.get(id);

          const updatedLink = {
            ...originalLink,
            ...updateRequest.link
          };

          this.linksMap.set(id, updatedLink);
          this.setLinkProperties(id);
        }
      });
  }

  private setLinks(links: Array<NgLink>): void {
    this.links.push(...links);
    for (const link of links) {
      this.linksMap.set(link.id, link);
    }
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
    this.renderer.setStyle(childNodeElement, 'stroke-width', link.style ? link.style.width : 2);
    this.renderer.setStyle(childNodeElement, 'stroke-dasharray', link.style && link.style.dashed ? 2 : 0);
    this.renderer.setStyle(childNodeElement, 'stroke', link.style ? link.style.color : 'gray');
    this.renderer.setStyle(childNodeElement, 'fill', link.style ? link.style.color : 'gray');

    const d = this.linkEndpointService.getD(link);
    this.renderer.setAttribute(childNodeElement, 'd', d);
  }

  trackByFn(index: number, link: NgLink): string {
    return link.id;
  }

}
