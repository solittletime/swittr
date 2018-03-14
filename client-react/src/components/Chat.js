import React from "react";

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
        })}
      </div>
    );
  }
}

export default Chat;
