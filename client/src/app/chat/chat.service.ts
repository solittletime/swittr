import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class ChatService {
  private socket;

  constructor() {
    this.socket = io();
  }

  public sendMessage(message) {
    this.socket.emit('add-message', message);
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('message', (message) => {
        observer.next(message);
      });
    });
  }
}
