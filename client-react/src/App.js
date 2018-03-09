import React, { Component } from 'react';
import './App.css';
import Chat from "./Chat";

class App extends Component {
  render() {
    return (
      <main className="main">
        <div className="posts-alert"></div>
        <div className="scroller posts">
          <Chat />
        </div>
        <div className="toasts"></div>
      </main>
    );
  }
}

export default App;
