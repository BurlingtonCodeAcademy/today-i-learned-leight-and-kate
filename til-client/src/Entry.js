import React, { Component } from "react";
import moment from "moment";
import "./App.css";

class Entry extends Component {
  constructor(props) {
    super(props);

  }
  render() {
    return (
      <div className="Entry-box">
        <div className="Entry-time">
          {moment(this.props.when).format("MMMM Do, YYYY")}
          <br />
        </div>
        <div className="Entry-title">{this.props.title}</div>
        <br />

        <div className="Entry-body">{this.props.body}</div>
        <br />
        <div className="Entry-author">{this.props.author}</div>
      </div>
    );
  }
}

export default Entry;
