import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  toasts = [];
  settings = { opacity: 1, label: 'Unable to connect. Retrying…' };

  constructor() {
    this.toasts.push({ action: 'refresh', button: 'refresh' });
    this.toasts.push({ action: 'dismiss', button: 'dismiss' });

    localStorage.setItem('sw12', '333');
    const cat = localStorage.getItem('sw12');
    localStorage.removeItem('sw12');
    this.post();
  }

  ngOnInit() {
  }

  sendMessage(name) {
    console.log(name + ' 123');
    this.settings.opacity = 0;
  }

  public post() {
    console.log('post');

    if ('serviceWorker' in navigator) {
      const indexController = this;

      navigator.serviceWorker.register('/sw.js').then(function (reg) {
        if (!navigator.serviceWorker.controller) {
          return;
        }

        setTimeout(() => {

          console.log('pause 1');

          if (reg.waiting) {
            console.log('reg.waiting');
//          indexController._updateReady(reg.waiting);
            return;
          }

          if (reg.installing) {
            console.log('reg.installing');
//          indexController._trackInstalling(reg.installing);
            return;
          }

        }, 3000); // 5 second delay needed for these events

        console.log('pause 2');

      });
    }
  }
}
