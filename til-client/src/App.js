import React, { Component } from "react";
import Entry from "./Entry.js";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = { entries: [] };
  }

  componentDidMount() {
    fetch("http://10.1.10.58:5000/facts")
      .then(response => response.json())
      .then(data => this.setState({ entries: data }));
  }

  render() {
    console.log(typeof this.state);
    return (
      <div className="App">
        <header className="App-header">
          <h1>Today I Learned</h1>
        </header>

        <p className="Entry-box">Learn Things</p>
        {this.state.entries.map(entry => (
          <Entry key={entry._id} when={entry.when} text={entry.text} />
        ))}
      </div>
    );
  }
}

export default App;
