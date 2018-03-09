import React from "react";
import io from "socket.io-client";
import lisa from './lisa-1x.png';

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
      <div>
        {this.state.messages.map(message => {
          return (
            <article className="card post">
              <div className="post-content">
                <img className="post-avatar" alt="" width="40" height="40" src={lisa} />
                <div className="post-text-content">
                  <div className="post-title">
                    <h1 className="post-heading">{message.name}</h1>
                    <time className="post-time" datetime="2018-02-04T20:31:07.460Z">{message.timeDifference}}</time>
                  </div>
                  <p>{message.text}</p>
                </div>
              </div>
            </article>
          )
        })}
      </div>

    );
  }
}

export default Chat;