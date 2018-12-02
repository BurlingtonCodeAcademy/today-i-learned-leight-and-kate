import React, { Component } from "react";
import "./App.css";

class Form extends Component {
  render() {
    return (
      <form id="grid-container" onSubmit={this.props.handleSubmit}>
        <input
          type="text"
          name="title"
          autoComplete="off"
          placeholder="title"
          id="title"
          value={this.props.title}
          onChange={this.props.handleChange}
        />
        <input
          type="text"
          name="author"
          placeholder="author"
          id="author"
          value={this.props.author}
          onChange={this.props.handleChange}
        />
        <textarea
          name="body"
          autoComplete="off"
          placeholder="body"
          value={this.props.body}
          onChange={this.props.handleChange}
        />
        <input type="submit" value={this.props.buttonText} className="button" />
      </form>
    );
  }
}

export default Form;
