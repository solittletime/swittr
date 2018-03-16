import React from "react";
import io from "socket.io-client";
import idb from 'idb';
import Chat from '../components/Chat';
import Key from '../components/Key';
import Toast from '../components/Toast';
import timeDifference from '../utils/timeUtil';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    var _ = this;

    this.dbPromise = this.openDatabase();

    this.state = {
      index: 0,
      opacity: 0,
      message: '',
      messages: [],
      images: []
    };

    this.state.images['Homer'] = require('../images/homer-1x.png');
    this.state.images['Lisa'] = require('../images/lisa-1x.png');

    this.currentServiceWorker = null;

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleToast = this.handleToast.bind(this);

    this.socket = io();

    this.socket.on('message', (data) => {
      var messages = JSON.parse(data);

      this.dbPromise.then(function (db) {
        if (!db) return;

        var tx = db.transaction('swittrs', 'readwrite');
        var store = tx.objectStore('swittrs');
        messages.forEach(function (message) {
          store.put(message);
        });

        // limit store to 10 items
        store.index('by-date').openCursor(null, "prev").then(function (cursor) {
          return cursor.advance(10);
        }).then(function deleteRest(cursor) {
          if (!cursor) return;
          cursor.delete();
          return cursor.continue().then(deleteRest);
        });
      });

      messages.forEach(function (message) {
        _.state.messages.push(message);
      });

      var index, len;
      for (index = 0, len = this.state.messages.length; index < len; ++index) {
        this.state.messages[index].timeDifference = timeDifference(this.state.messages[index].time);
      }

      setTimeout(() => {
        const el = document.getElementById('scroll-id');
        el.scrollTop = el.scrollHeight - el.clientHeight;
      }, 100);

      this.setState({ messages: this.state.messages });
    });

    this.sendMessage = (data) => {
      this.socket.emit('add-message', data);
      this.setState({ message: '' });
    }

    this.socket.on('connect', () => {
      console.log('connect');
      this.setState({ index: 0 });
      this.setState({ opacity: 0 });
    });

    this.showCachedMessages().then(function() {
      // indexController._openSocket();
    });
  
    this.socket.on('disconnect', (reason) => {
      console.log(reason);
      this.setState({ index: 0 });
      this.setState({ opacity: 1 });
    });

    this.updateServiceWorker();
    // this.cleanImageCache();

    setInterval(function () {
      _.cleanImageCache();
    }, 1000 * 60 * 5);
  }

  handleChange(event) {
    this.setState({ message: event.target.value });
  }

  handleClick(event) {
    this.sendMessage(this.state.message);
    event.preventDefault();
  }

  handleToast(action) {
    if (action === 'refresh' && this.currentServiceWorker) {
      this.currentServiceWorker.postMessage({ action: 'skipWaiting' });
      this.currentServiceWorker = null;
    }
    this.setState({ opacity: 0 });
  }

  updateServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      return;
    }
    const _ = this;

    navigator.serviceWorker.register('/service-worker.js').then(function (reg) {
      if (!navigator.serviceWorker.controller) {
        return;
      }

      setTimeout(() => {
        if (reg.waiting) {
          _.updateReady(reg.waiting);
          return;
        }

        if (reg.installing) {
          _.trackInstalling(reg.installing);
          return;
        }

        reg.addEventListener('updatefound', function () {
          _.trackInstalling(reg.installing);
        });
      }, 3000); // 3 second delay needed
    });

    // Ensure refresh is only called once.
    // This works around a bug in "force update on reload".
    var refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      console.log('controllerchange');
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
  }

  trackInstalling(worker) {
    const _ = this;
    console.log('trackInstalling');
    worker.addEventListener('statechange', function () {
      if (worker.state === 'installed') {
        _.updateReady(worker);
      }
    });
  }

  updateReady(worker) {
    this.setState({ index: 1 });
    this.setState({ opacity: 1 });
    this.currentServiceWorker = worker;
  }

  openDatabase() {
    // If the browser doesn't support service worker,
    // we don't care about having a database
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }

    return idb.open('swittr', 1, function (upgradeDb) {
      var store = upgradeDb.createObjectStore('swittrs', {
        keyPath: 'id'
      });
      store.createIndex('by-date', 'time');
    });
  }

  render() {
    return ([
      <header className="toolbar">
        <h1 className="site-title">Swittr</h1>
      </header>,
      <main className="main">
        <div className="posts-alert"></div>
        <Chat
          images={this.state.images}
          messages={this.state.messages}
        />
        <Toast
          index={this.state.index}
          opacity={this.state.opacity}
          onClick={(action) => this.handleToast(action)}
        />
      </main>,
      <footer className="footer">
        <Key
          message={this.state.message}
          onChange={(event) => this.handleChange(event)}
          onClick={(event) => this.handleClick(event)}
        />
      </footer>
    ]);
  }
}

App.prototype.showCachedMessages = function () {
  var _ = this;

  return this.dbPromise.then(function (db) {
    // if we're already showing posts, eg shift-refresh
    // or the very first load, there's no point fetching
    // posts from IDB
    if (!db || _.state.messages.length > 0) return;

    var index = db.transaction('swittrs')
      .objectStore('swittrs').index('by-date');

      return index.getAll().then(function (messages) {
      messages.forEach(function (message) {
        _.state.messages.push(message);
      });
      _.setState({ messages: _.state.messages });
    });
  });
};

App.prototype.cleanImageCache = function () {
  return this.dbPromise.then(function (db) {
    if (!db) return;

    var imagesNeeded = [];

    var tx = db.transaction('swittrs');
    return tx.objectStore('swittrs').getAll().then(function (messages) {
      messages.forEach(function (message) {
        if (message.photo) {
          imagesNeeded.push(message.photo);
        }
        imagesNeeded.push(message.avatar);
      });

      return caches.open('swittr-content-imgs');
    }).then(function (cache) {
      return cache.keys().then(function (requests) {
        requests.forEach(function (request) {
          var url = new URL(request.url);
          if (!imagesNeeded.includes(url.pathname)) cache.delete(request);
        });
      });
    });
  });
};

export default App;
