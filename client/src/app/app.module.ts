import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';

import { environment } from '../environments/environment';
import { KeyComponent } from './key/key.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    KeyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
