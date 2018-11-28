import React, { Component } from "react";
import Entry from "./Entry.js";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = { entries: [], author: "", title: "", body: "" };
  }

  componentDidMount() {
    fetch("http://10.1.10.58:5000/facts")
      .then(response => response.json())
      .then(data => this.setState({ entries: data }));
  }

  // componentDidUpdate(prevState) {
  //   console.log(this.state.entries);

  //   console.log(prevState.entries);
  //   console.log(prevState);
  //   if (this.state.entries !== prevState.entries) {
  //     fetch("http://10.1.10.58:5000/facts")
  //       .then(response => response.json())
  //       .then(data => this.setState({ entries: data }));
  //   }
  // }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { author, title, body } = this.state;
    fetch("http://10.1.10.58:5000/facts", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ author: author, title: title, body: body })
    }).then(response => response.json());
    // clean this up
    const newState = this.state;
    this.setState({ author: "", title: "", body: "" });
    this.state.entries.push({ author: author, title, body });
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
        {this.state.entries.map(entry => (
          <Entry key={entry._id} {...entry} />
        ))}
      </div>
    );
  }
}

export default App;
