import React, { Component } from "react";
import moment from "moment";
import "./App.css";

class Entry extends Component {
  handleDelete = () => this.props.deleteEntry(this.props._id);
  handleEdit = () => this.props.renderForm(this.props._id);

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
        <div className="buttonArea">
          <button className="small-button" id="edit" onClick={this.handleEdit}>
            edit
          </button>
          <button
            className="small-button"
            id="delete"
            onClick={this.handleDelete}
          >
            delete
          </button>
        </div>
      </div>
    );
  }
}

export default Entry;
