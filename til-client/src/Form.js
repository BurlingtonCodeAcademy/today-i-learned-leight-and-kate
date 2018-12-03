import React from "react";
import PropTypes from "prop-types";
import "./App.css";

const Form = props => (
  <>
    <form id="grid-container" onSubmit={props.handleSubmit}>
      <input
        type="text"
        name="title"
        autoComplete="off"
        placeholder="title"
        id="title"
        value={props.title}
        onChange={props.handleChange}
      />
      <input
        type="text"
        name="author"
        placeholder="author"
        id="author"
        value={props.author}
        onChange={props.handleChange}
      />
      <textarea
        name="body"
        autoComplete="off"
        placeholder="body"
        id="body"
        value={props.body}
        onChange={props.handleChange}
      />
      <input type="submit" value={props.buttonText} className="button" />
    </form>
    {props.renderEntry && (
      <button
        onClick={() => props.renderEntry()}
        className="button"
        id="cancel"
      >
        Cancel
      </button>
    )}
  </>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  _id: PropTypes.string,
  renderEntry: PropTypes.func,
  when: PropTypes.string
};

export default Form;
