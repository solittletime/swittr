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
  names = [
    { label: 'Unable to connect. Retrying…', actions: ['dismiss'] },
    { label: 'New version available', actions: ['refresh', 'dismiss'] }
  ];
  opacity = 0;
  index = 0;

  clickSource = new Subject<any>();
  clickValue = this.clickSource.asObservable();

  constructor(private ioService: IOService) {
    this.updateServiceWorker();
  }

  ngOnInit() {
    this.ioService.getDisconnect().subscribe(data => {
      this.opacity = 1;
      this.index = 0;
    });
    this.ioService.getConnect().subscribe(() => {
      if (this.index === 0) {
        this.opacity = 0;
      }
    });
  }

  buttonClicked(action) {
    this.clickSource.next(action);
    this.opacity = 0;
  }

  updateServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      return;
    }
    const _toast = this;

    navigator.serviceWorker.register('/sw.js').then(function (reg) {
      if (!navigator.serviceWorker.controller) {
        return;
      }

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

  trackInstalling(worker) {
    const _toast = this;
    worker.addEventListener('statechange', function () {
      if (worker.state === 'installed') {
        _toast.updateReady(worker);
      }
    });
  }

  updateReady(worker) {
    this.opacity = 1;
    this.index = 1;

    const _ = this.clickValue.subscribe(answer => {
      if (answer === 'refresh') {
        worker.postMessage({ action: 'skipWaiting' });
      }
      _.unsubscribe();
    });
  }
}
