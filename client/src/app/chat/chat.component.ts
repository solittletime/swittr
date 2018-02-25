import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from './chat.service';
import timeService from '../util/util.time';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService]
})
export class ChatComponent implements OnInit, OnDestroy {
  title = 'swittr';
  message;
  messages = [];
  connection;

  constructor(private chatService: ChatService) {
  }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  ngOnInit() {
    this.connection = this.chatService.getMessages().subscribe(
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
