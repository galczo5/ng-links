import {AfterViewInit, Component} from '@angular/core';
import {NgLinkRepositoryService} from '../../projects/ng-link/src/lib/ng-link-repository.service';
import {NgLink, NgLinkType} from '../../projects/ng-link/src/lib/ng-link';

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
  linkTypes = [NgLinkType.ES, NgLinkType.SE, NgLinkType.SS, NgLinkType.EE];

  buttonWidth = 120;
  buttonHeight = 32;

  count = 0;
  hideEndpoints = false;

  constructor(private readonly linkRepositoryService: NgLinkRepositoryService) {
    const urlParams = new URLSearchParams(window.location.search);
    this.count = +urlParams.get('count') || 4;
    this.hideEndpoints = urlParams.get('noEndpoints') === 'true';
  }

  getButtonEndX(link: NgLink): number {
    if (link.type === NgLinkType.ES || link.type === NgLinkType.SS) {
      return link.end.x;
    } else {
      return link.end.x - this.buttonWidth;
    }
  }

  ngAfterViewInit() {
    this.generateItems();
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
