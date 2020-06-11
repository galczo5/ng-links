import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgLinkModule} from '../../projects/ng-link/src/lib/ng-link.module';
import { TestEndpointComponent } from './test-endpoint/test-endpoint.component';

@NgModule({
  declarations: [
    AppComponent,
    TestEndpointComponent
  ],
  imports: [
    BrowserModule,
    NgLinkModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
