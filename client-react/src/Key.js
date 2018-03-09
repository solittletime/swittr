import React from "react";
import './App.css';
import './Key.css';

class Key extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      message: '',
      buttons: []
    };
  }

  render() {
    return (
      <div>
        <form>
          <span class="span-input">
            <input class="input" />
          </span>
          <span class="span-button">
            <button onClick="sendMessage()" class="button">Send</button>
          </span>
        </form>
      </div>
    );
  }
}

export default Key;