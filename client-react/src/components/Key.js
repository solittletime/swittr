import React from "react";
import './Key.css';

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

export default Key;
