import {Component, Input} from '@angular/core';
import {NgLink} from '../../../projects/ng-link/src/lib/ng-link';

@Component({
  selector: 'app-test-endpoint-info',
  template: `
    <div>
      <span class="badge badge-secondary mr-1">{{link.type}}</span>
      <span class="badge badge-secondary">{{link.id}}</span>
    </div>
  `
})
export class EndpointInfoComponent {

  @Input()
  link: NgLink;

}
