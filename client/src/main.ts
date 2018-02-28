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

      if (reg.waiting) {
        console.log('update ready');
//        indexController._updateReady(reg.waiting);
        return;
      }

//      if (reg.installing) {
//        indexController._trackInstalling(reg.installing);
//        return;
//      }

//      reg.addEventListener('updatefound', function () {
//        indexController._trackInstalling(reg.installing);
//      });
    });
  }
}).catch(err => console.log(err));
