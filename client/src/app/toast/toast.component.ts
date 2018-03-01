import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { IOService } from '../service/io.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  actions = [];
  settings = { opacity: 0, label: '' };
  private moduleSource = new Subject<any>();
  moduleValue = this.moduleSource.asObservable();

  constructor(private ioService: IOService) {
    //localStorage.setItem('sw12', '333');
    //const cat = localStorage.getItem('sw12');
    //localStorage.removeItem('sw12');
    this.updateServiceWorker();
  }

  ngOnInit() {
    this.ioService.getDisconnect().subscribe(data => {
      this.settings.opacity = 1;
      this.settings.label = 'Unable to connect. Retrying…';
      this.actions = ['dismiss'];
      console.log('4441 ' + data);
    });
    this.ioService.getConnect().subscribe(() => {
      console.log('4442 connect');
    });
  }

  sendMessage(answer) {
    this.moduleSource.next(answer);
    this.settings.opacity = 0;
  }

  public updateServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    const _toast = this;

    navigator.serviceWorker.register('/sw.js').then(function (reg) {
      if (!navigator.serviceWorker.controller) return;

      setTimeout(() => {
        if (reg.waiting) {
          _toast.updateReady(reg.waiting);
          return;
        }

        if (reg.installing) {
          _toast.trackInstalling(reg.installing);
          return;
        }

        reg.addEventListener('updatefound', function () {
          _toast.trackInstalling(reg.installing);
        });
      }, 3000); // 3 second delay needed
    });
  }

  public trackInstalling(worker) {
    const _toast = this;
    worker.addEventListener('statechange', function () {
      if (worker.state == 'installed') {
        _toast.updateReady(worker);
      }
    });
  };

  updateReady(worker) {
    this.settings.opacity = 1;
    this.settings.label = 'New version available';
    this.actions = ['refresh', 'dismiss'];

    const _val = this.moduleValue.subscribe(answer => {
      console.log('aaa ' + answer);
      if (answer == 'refresh') {
        worker.postMessage({ action: 'skipWaiting' });
      }
      _val.unsubscribe();
    })
  };
}
