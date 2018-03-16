import React from "react";
import io from "socket.io-client";
import Chat from '../components/Chat';
import Key from '../components/Key';
import Toast from '../components/Toast';
import timeDifference from '../utils/timeUtil';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

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
      var _ = this;
      messages.forEach(function(message) {
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

    this.socket.on('disconnect', (reason) => {
      console.log(reason);
      this.setState({ index: 0 });
      this.setState({ opacity: 1 });
    });

    this.updateServiceWorker();
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

export default App;
