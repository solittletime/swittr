import React, { Component } from 'react';
import './App.css';
import Chat from "./Chat";
import Toast from "./Toast";
import Key from "./Key";

class App extends Component {
  render() {
    return ([
      <header class="toolbar">
        <h1 class="site-title">Swittr</h1>
      </header>,
      <main className="main">
        <div className="posts-alert"></div>
        <Chat />
        <Toast />
      </main>,
      <footer class="footer">
        <Key />
      </footer>
    ]);
  }
}

export default App;
