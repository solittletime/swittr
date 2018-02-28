import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
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
//        indexController._updateReady(reg.waiting);
          return;
        }

        if (reg.installing) {
          console.log('reg.installing');
//        indexController._trackInstalling(reg.installing);
          return;
        }

      }, 5000); // 5 second delay needed for these events

      console.log('pause 2');

//      reg.addEventListener('updatefound', function () {
//        indexController._trackInstalling(reg.installing);
//      });
    });
  }
}).catch(err => console.log(err));
