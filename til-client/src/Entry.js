import React, { Component } from "react";
import "./App.css";

class Entry extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div className="Entry-box">{this.props.when}<br/>{this.props.text}</div>;
  }
}

export default Entry;
