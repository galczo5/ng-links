import { Injectable } from '@angular/core';
import {NgLink} from './ng-link';
import {Observable, ReplaySubject, Subject} from 'rxjs';

export type NgLinkUpdate = { id: string, link: Partial<NgLink> };

@Injectable({
  providedIn: 'root'
})
export class NgLinkRepositoryService {

  private readonly linksAdded$: ReplaySubject<Array<NgLink>> = new ReplaySubject<Array<NgLink>>(1);
  private readonly linksUpdated$: ReplaySubject<Array<NgLinkUpdate>> = new ReplaySubject<Array<NgLinkUpdate>>();
  private readonly linksDeleted$: ReplaySubject<Array<string>> = new ReplaySubject<Array<string>>();

  addLinks(links: Array<NgLink>): void {
    this.linksAdded$.next(links);
  }

  removeLinks(ids: Array<string>): void {
    this.linksDeleted$.next(ids);
  }

  updateLink(links: Array<NgLinkUpdate>): void {
    this.linksUpdated$.next(links);
  }

  selectLinksAdded(): Observable<Array<NgLink>> {
    return this.linksAdded$.asObservable();
  }

  selectLinksDeleted(): Observable<Array<string>> {
    return this.linksDeleted$.asObservable();
  }

  selectLinksUpdated(): Observable<Array<NgLinkUpdate>> {
    return this.linksUpdated$.asObservable();
  }

}
