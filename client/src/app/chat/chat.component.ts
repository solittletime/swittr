import { Component, OnInit, OnDestroy } from '@angular/core';
import { IOService } from '../service/io.service';
import timeDifference from '../util/time.util';
import { ScrollDirective } from '../scroll.directive';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  title = 'swittr';
  messages = [];
  connection;

  constructor(private ioService: IOService, private scroll: ScrollDirective) {
  }

  ngOnInit() {
    this.connection = this.ioService.getMessages().subscribe(
      message => {
        this.messages.push(message);
        this.messages.forEach((data) => {
          data.timeDifference = timeDifference(data.time);
        });

        setTimeout(() => {
          const el = this.scroll.getElement().nativeElement;
          el.scrollTop = el.scrollHeight - el.clientHeight;
        }, 100);

      });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
