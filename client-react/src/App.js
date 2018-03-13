import React from "react";
import './App.css';
import './Key.css';
import './index.css';
import io from "socket.io-client";
import homer from './homer-1x.png';
import lisa from './lisa-1x.png';
import timeDifference from './util/time.util';

class Toast extends React.Component {
  names = [
    { label: 'Unable to connect. Retrying…', actions: ['dismiss'] },
    { label: 'New version available', actions: ['refresh', 'dismiss'] }
  ];
  index = 0;

  render() {
    return (
      <div className="toasts">
        <div className="toast" style={{ opacity: 1 }}>
          <div className="toast-content">Blah Blah Blah</div>
          <button className="unbutton">Dismiss</button>
        </div>
      </div>
    );
  }
}

class Chat extends React.Component {
  render() {
    return (
      <div className="scroller posts">
        {this.props.messages.map(message => {
          if (message.name === "Homer") {
            return (
              <article className="card post">
                <div className="post-content">
                  <img className="post-avatar" alt="" width="40" height="40" src={homer} />
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
          } else {
            return (
              <article className="card post">
                <div className="post-content">
                  <img className="post-avatar" alt="" width="40" height="40" src={lisa} />
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
        })}
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
      username: '',
      message: '',
      messages: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.socket = io();

    this.socket.on('message', (data) => {
      console.log(data);
      this.state.messages.push(data);
      var index, len;
      for (index = 0, len = this.state.messages.length; index < len; ++index) {
        this.state.messages[index].timeDifference = timeDifference(this.state.messages[index].time);
      }
      this.setState({ messages: this.state.messages });
    });

    this.sendMessage = (data) => {
      this.socket.emit('add-message', data);
      this.setState({ message: '' });
    }

    this.socket.on('connect', () => {
      console.log('connect');
    });

    this.socket.on('disconnect', (reason) => {
      console.log(reason);
    });
  }

  handleChange(event) {
    this.setState({ message: event.target.value });
  }

  handleClick(event) {
    this.sendMessage(this.state.message);
    event.preventDefault();
  }

  render() {
    return ([
      <header className="toolbar">
        <h1 className="site-title">Swittr</h1>
      </header>,
      <main className="main">
        <div className="posts-alert"></div>
        <Chat messages={this.state.messages} />
        <Toast />
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
