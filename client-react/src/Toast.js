import React from "react";
import './App.css';

class Toast extends React.Component {
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
      <div className="toasts">
        <div className="toast" style={{opacity: 1}}>
          <div className="toast-content">Blah Blah Blah</div>
          <button className="unbutton">Dismiss</button>
        </div>
      </div>
    );
  }
}

export default Toast;