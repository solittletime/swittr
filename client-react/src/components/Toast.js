import React from "react";

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

export default Toast;
