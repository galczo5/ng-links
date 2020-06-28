import { Injectable } from '@angular/core';
import {NgLinkRepositoryService} from './ng-link-repository.service';
import {NgLink} from './ng-link';
import {NgViewportRepositoryService} from './ng-viewport-repository.service';

@Injectable()
export class NgLinkViewportService {

  private links: Map<string, NgLink> = new Map<string, NgLink>();
  private visibleLinks: Map<string, NgLink> = new Map<string, NgLink>();

  private width = 0;
  private height = 0;

  private top = 0;
  private left = 0;

  constructor(private readonly linkRepositoryService: NgLinkRepositoryService,
              private readonly viewportRepositoryService: NgViewportRepositoryService) { }

  init(): void {
    this.linkRepositoryService.selectLinksAdded()
      .subscribe(links => {
        const result = [];
        for (const link of links) {
          this.links.set(link.id, link);

          if (this.linkVisible(link)) {
            this.visibleLinks.set(link.id, link);
            result.push(link);
          }
        }

        this.viewportRepositoryService.addLinks(result);
      });

    this.linkRepositoryService.selectLinksUpdated()
      .subscribe(links => {
        const result = [];
        for (const link of links) {
          const originalLink = this.links.get(link.id);
          const updatedLink = {
            ...originalLink,
            ...link
          };

          this.links.set(link.id, updatedLink);

          if (this.linkVisible(updatedLink)) {
            this.visibleLinks.set(link.id, link);
            result.push(updatedLink);
          }
        }

        this.viewportRepositoryService.updateLink(result);
      });

    this.linkRepositoryService.selectLinksDeleted()
      .subscribe(links => {

        for (const id of links) {
          this.visibleLinks.delete(id);
        }

        this.viewportRepositoryService.removeLinks(links);
      });
  }

  destroy(): void {

  }

  setViewportSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.checkAll();
  }

  setViewportPosition(top: number, left: number): void {
    this.top = top;
    this.left = left;
    this.checkAll();
  }

  private checkAll(): void {
    const linksToHide = [];
    const linksToAdd = [];

    this.links.forEach(link => {
      if (this.linkVisible(link) && !this.visibleLinks.has(link.id)) {
        linksToAdd.push(link);
      } else if (this.visibleLinks.has(link.id)) {
        linksToHide.push(link);
      }
    });

    this.viewportRepositoryService.addLinks(linksToAdd);
    this.viewportRepositoryService.removeLinks(linksToHide);
  }

  // POC
  private linkVisible(link: NgLink): boolean {

    if (link.end.y < this.top) {
      return false;
    }

    if (link.end.x < this.left) {
      return false;
    }

    if (link.start.y > this.top + this.height) {
      return false;
    }

    if (link.start.x > this.left + this.width) {
      return false;
    }

    return true;

  }

}
