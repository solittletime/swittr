import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class IOService {
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

  public getConnect = () => {
    return Observable.create((observer) => {
      this.socket.on('connect', () => {
        console.log('connect');
      });
    });
  }

  public getDisconnect = () => {
    return Observable.create((observer) => {
      this.socket.on('disconnect', (reason) => {
        console.log(reason);
      });
    });
  }
}
