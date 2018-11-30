import React, { Component } from "react";
import Entry from "./Entry.js";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = { entries: [], author: "", title: "", body: "" };
  }

  componentDidMount() {
    fetch(`/facts`)
      .then(response => response.json())
      .then(data => this.setState({ entries: data }))
      .catch(() => this.setState({ status: "Failed to fetch content" }));
  }

  componentDidUpdate() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.setState({ status: "" }), 3000);
  }

  handleChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  handleSubmit = event => {
    event.preventDefault();
    const { author, title, body, entries } = this.state;
    if (!title.trim())
      return this.setState({ status: "Entry must have a title" });
    fetch(`/facts`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ author, title, body })
    })
      .then(response => response.json())
      .then(entry => {
        entries.unshift({ author, title, body, _id: entry.id });
        this.setState({
          author: "",
          title: "",
          body: "",
          entries,
          status: "Entry successfully posted!"
        });
      })
      .catch(() => this.setState({ status: "Entry failed to post" }));
  };

  deleteEntry = id => {
    const updatedEntries = this.state.entries.filter(entry => id !== entry._id);
    fetch(`/facts`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    })
      .then(response => response.json())
      .then(() =>
        this.setState({ entries: updatedEntries, status: "Entry deleted" })
      );
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Today I Learned</h1>
          <form id="grid-container" onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="title"
              autoComplete="off"
              placeholder="title"
              id="title"
              value={this.state.title}
              onChange={this.handleChange}
            />
            <input
              type="text"
              name="author"
              placeholder="author"
              id="author"
              value={this.state.author}
              onChange={this.handleChange}
            />
            <textarea
              name="body"
              autoComplete="off"
              placeholder="body"
              value={this.state.body}
              onChange={this.handleChange}
            />
            <input type="submit" value="Post" className="button" />
          </form>
        </header>
        <div className="status">{this.state.status}</div>
        {this.state.entries.map(entry => (
          <Entry key={entry._id} {...entry} deleteEntry={this.deleteEntry} />
        ))}
      </div>
    );
  }
}

export default App;
