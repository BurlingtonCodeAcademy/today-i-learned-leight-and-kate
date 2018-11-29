import React, { Component } from "react";
import Entry from "./Entry.js";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = { entries: [], author: "", title: "", body: "" };
    const BCA = "http://10.1.10.58";
    // const LOCAL = "http://localhost";
    this.PATH = BCA;
  }

  componentDidMount() {
    fetch(`${this.PATH}:5000/facts`)
      .then(response => response.json())
      .then(data => this.setState({ entries: data }))
      .catch(() => this.setState({ status: "Failed to fetch content" }));
  }

  componentDidUpdate() {
    setTimeout(() => this.setState({ status: "" }), 5000);
  }

  handleChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  handleSubmit = event => {
    event.preventDefault();
    const { author, title, body, entries } = this.state;
    if (!title.trim())
      return this.setState({ status: "TIL must have a title" });
    fetch(`${this.PATH}:5000/facts`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ author: author, title: title, body: body })
    })
      .then(() => {
        entries.unshift({ author: author, title, body });
        this.setState({
          author: "",
          title: "",
          body: "",
          entries,
          status: "Successfully Posted!"
        });
      })
      .catch(() => this.setState({ status: "Failed to post content" }));
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
        <div>{this.state.status}</div>
        {this.state.entries.map(entry => (
          <Entry key={entry._id} {...entry} />
        ))}
      </div>
    );
  }
}

export default App;
