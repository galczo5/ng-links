import { NgModule } from '@angular/core';
import { NgLinkContainerComponent } from './ng-link-container.component';
import {CommonModule} from '@angular/common';
import { NgLinkViewportComponent } from './ng-link-viewport.component';

@NgModule({
  declarations: [NgLinkContainerComponent, NgLinkViewportComponent],
  imports: [CommonModule],
  exports: [NgLinkContainerComponent, NgLinkViewportComponent]
})
export class NgLinkModule { }
