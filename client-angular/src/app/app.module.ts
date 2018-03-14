import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';

import { environment } from '../environments/environment';
import { KeyComponent } from './key/key.component';
import { ToastComponent } from './toast/toast.component';
import { ScrollDirective } from './directives/scroll.directive';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    KeyComponent,
    ToastComponent,
    ScrollDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
