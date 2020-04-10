import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentComponent } from './content/content.component';
import { ButtonComponent } from './button/button.component';
import { SuggestionComponent } from './suggestion/suggestion.component';

@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    ButtonComponent,
    SuggestionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
