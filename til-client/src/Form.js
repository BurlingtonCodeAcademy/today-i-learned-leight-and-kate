import React, { Component } from "react";
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

export default Form;
