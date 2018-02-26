import { Component, OnInit, OnDestroy } from '@angular/core';
import { IOService } from '../service/io.service';
import timeService from '../util/util.time';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  title = 'swittr';
  messages = [];
  connection;

  constructor(private ioService: IOService) {
  }

  ngOnInit() {
    this.connection = this.ioService.getMessages().subscribe(
      message => {
        this.messages.push(message);
        this.messages.forEach((data) => {
          data.timeDifference = timeService(data.time);
        });
      });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
