import React from "react";
import io from "socket.io-client";
import homer from './homer-1x.png';
import lisa from './lisa-1x.png';
import timeDifference from './util/time.util';

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      message: '',
      messages: []
    };

    this.socket = io();

    this.socket.on('message', function (data) {
      addMessage(data);
    });

    const addMessage = data => {
      console.log(data);
      this.setState({ messages: [...this.state.messages, data] });
      var index, len;
      for (index = 0, len = this.state.messages.length; index < len; ++index) {
        this.state.messages[index].timeDifference = timeDifference(this.state.messages[index].time);
      }
      this.setState({ messages: this.state.messages });
      console.log(this.state.messages);
    };

    this.sendMessage = ev => {
      ev.preventDefault();
      this.socket.emit('add-message', this.state.message)
      this.setState({ message: '' });

    }
  }
  render() {
    return (
      <div className="scroller posts">
        {this.state.messages.map(message => {
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

export default Chat;