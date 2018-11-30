import React, { Component } from "react";
import Entry from "./Entry.js";
import Form from "./Form.js";
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

  editEntry = id => this.setState({ editId: id });

  editChange = event => {
    const entryToEdit = this.state.entries.filter(
      entry => entry._id === this.state.editId
    )[0];
    const field = event.target.name;
    entryToEdit[field] = event.target.value;
    this.setState({ entryToEdit });
  };

  editSubmit = event => {
    event.preventDefault();
    const entryToEdit = this.state.entries.filter(
      entry => entry._id === this.state.editId
    )[0];
    const { author, title, body } = entryToEdit;

    fetch(`/facts/${this.state.editId}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ author, title, body })
    }); //.then(response => response.json());
    /*
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
        */
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Today I Learned</h1>
          <Form
            {...this.state}
            handleSubmit={this.handleSubmit}
            handleChange={this.handleChange}
          />

          {/*<form id="grid-container" onSubmit={this.handleSubmit}>
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
    </form>*/}
        </header>
        <div className="status">{this.state.status}</div>
        {this.state.entries.map(entry => {
          let result;
          if (this.state.editId === entry._id) {
            result = (
              <Form
                key={entry._id}
                {...entry}
                handleSubmit={this.editSubmit}
                handleChange={this.editChange}
              />
            );
          } else {
            result = (
              <Entry
                key={entry._id}
                {...entry}
                deleteEntry={this.deleteEntry}
                editEntry={this.editEntry}
              />
            );
          }
          return result;
        })}
      </div>
    );
  }
}

export default App;
