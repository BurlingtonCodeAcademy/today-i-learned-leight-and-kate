import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "./App.css";

class Entry extends Component {
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
          <button
            className="small-button"
            id="edit"
            onClick={() => this.props.renderForm(this.props._id)}
          >
            edit
          </button>
          <button
            className="small-button"
            id="delete"
            onClick={() => this.props.deleteEntry(this.props._id)}
          >
            delete
          </button>
        </div>
      </div>
    );
  }
}

Entry.propTypes = {
  deleteEntry: PropTypes.func.isRequired,
  renderForm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
  when: PropTypes.string.isRequired
};

export default Entry;
