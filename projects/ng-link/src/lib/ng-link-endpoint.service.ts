import {Injectable} from '@angular/core';
import {NgLink, NgLinkEndpoint, NgLinkType} from './ng-link';
import {ee} from './calculations/ee';
import {es} from './calculations/es';
import {se} from './calculations/se';
import {ss} from './calculations/ss';

export const margin = 20;

@Injectable({
  providedIn: 'root'
})
export class NgLinkEndpointService {

  private readonly cache: Map<string, string> = new Map<string, string>();

  getD(link: NgLink): string {

    const key = this.getCacheKey(link);
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const d = this.calculateD(link);
    this.cache.set(key, d);
    return d;
  }

  private calculateD(link: NgLink): string {
    switch (link.type) {
      case NgLinkType.EE: return ee(link);
      case NgLinkType.ES: return es(link);
      case NgLinkType.SE: return se(link);
      case NgLinkType.SS: return ss(link);
    }
  }

  private getCacheKey(link: NgLink): string {
    return link.type + '#' + this.toString(link.start) + '#' + this.toString(link.end);
  }

  private toString(endpoint: NgLinkEndpoint): string {
    return endpoint.x + ',' + endpoint.y;
  }

}
