import React from "react";
import './App.css';
import './Key.css';
import './index.css';
import io from "socket.io-client";
import timeDifference from './util/time.util';

class Toast extends React.Component {
  names = [
    { label: 'Unable to connect. Retrying…', actions: ['dismiss'] },
    { label: 'New version available', actions: ['refresh', 'dismiss'] }
  ];

  render() {
    var _ = this;
    return (
      <div className="toasts">
        <div className="toast" style={{ opacity: this.props.opacity }}>
          <div className="toast-content">{this.names[this.props.index].label}</div>
          {this.names[this.props.index].actions.map(function (action, index) {
            return <button className="unbutton" onClick={(event) => _.props.onClick(action)}>{action}</button>;
          })}
        </div>
      </div >
    );
  }
}

class Chat extends React.Component {
  render() {
    var _ = this;
    return (
      <div className="scroller posts" id="scrollx">
        {this.props.messages.map(message => {
          return (
            <article className="card post">
              <div className="post-content">
                <img className="post-avatar" alt="" width="40" height="40" src={_.props.images[message.name]} />
                <div className="post-text-content">
                  <div className="post-title">
                    <h1 className="post-heading">{message.name}</h1>
                    <time className="post-time" datetime={message.time}>{message.timeDifference}</time>
                  </div>
                  <p>{message.text}</p>
                </div>
              </div>
            </article>
          )
        }
        )}
      </div>
    );
  }
}

class Key extends React.Component {
  render() {
    return (
      <div>
        <form>
          <span className="span-input">
            <input className="input" type="text" value={this.props.message} onChange={(event) => this.props.onChange(event)} />
          </span>
          <span className="span-button">
            <button className="button" onClick={(event) => this.props.onClick(event)}>Send</button>
          </span>
        </form>
      </div>
    );
  }
}

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

    this.state.images['Homer'] = require('./homer-1x.png');
    this.state.images['Lisa'] = require('./lisa-1x.png');

    this.serviceWorkers = [];

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleToast = this.handleToast.bind(this);

    this.socket = io();

    this.socket.on('message', (data) => {
      this.state.messages.push(data);
      var index, len;
      for (index = 0, len = this.state.messages.length; index < len; ++index) {
        this.state.messages[index].timeDifference = timeDifference(this.state.messages[index].time);
      }

      setTimeout(() => {
        const el = document.getElementById('scrollx');
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
    if (action === 'refresh' && this.serviceWorkers.length > 0) {
      console.log(this.serviceWorkers.length);
      var worker = this.serviceWorkers.pop();
      worker.postMessage({ action: 'skipWaiting' });
    }
    this.setState({ opacity: 0 });
  }

  updateServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      return;
    }
    const _toast = this;

    navigator.serviceWorker.register('/service-worker.js').then(function (reg) {
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
    console.log('trackInstalling');
    worker.addEventListener('statechange', function () {
      if (worker.state === 'installed') {
        _toast.updateReady(worker);
      }
    });
  }

  updateReady(worker) {
    this.setState({ index: 1 });
    this.setState({ opacity: 1 });
    this.serviceWorkers.push(worker);
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
