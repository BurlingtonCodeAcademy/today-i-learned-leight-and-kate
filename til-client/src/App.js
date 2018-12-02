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
    this.getEntries();
  }

  componentDidUpdate() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.setState({ status: "" }), 3000);
  }

  renderForm = id => this.setState({ editId: id });
  renderEntry = () => this.getEntries();

  handleChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  getEntries() {
    fetch(`/facts`)
      .then(response => response.json())
      .then(entries => this.setState({ entries, editId: "" }))
      .catch(() => this.setState({ status: "Failed to fetch content" }));
  }

  createEntry = event => {
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
      )
      .catch(() => this.setState({ status: "Failed to delete entry" }));
  };

  handleEditChange = event => {
    const entryToEdit = this.state.entries.filter(
      entry => entry._id === this.state.editId
    )[0];
    const field = event.target.name;
    entryToEdit[field] = event.target.value;
    this.setState({ entryToEdit });
  };

  updateEntry = event => {
    event.preventDefault();
    const entryToEdit = this.state.entries.filter(
      entry => entry._id === this.state.editId
    )[0];
    const { author, title, body } = entryToEdit;
    if (!title.trim())
      return this.setState({ status: "Entry must have a title" });
    fetch(`/facts/${this.state.editId}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ author, title, body })
    })
      .then(response => response.json())
      .then(() => {
        this.setState({
          editId: "",
          status: "Entry successfully updated!"
        });
      })
      .catch(() => this.setState({ status: "Failed to update entry" }));
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Today I Learned</h1>
          {!this.state.editId && (
            <Form
              {...this.state}
              buttonText="Post"
              handleSubmit={this.createEntry}
              handleChange={this.handleChange}
            />
          )}
        </header>
        <div className="status">{this.state.status}</div>
        {this.state.entries.map(entry =>
          this.state.editId === entry._id ? (
            <Form
              key={entry._id}
              {...entry}
              buttonText="Update"
              handleSubmit={this.updateEntry}
              handleChange={this.handleEditChange}
              renderEntry={this.renderEntry}
            />
          ) : (
            <Entry
              key={entry._id}
              {...entry}
              deleteEntry={this.deleteEntry}
              renderForm={this.renderForm}
            />
          )
        )}
      </div>
    );
  }
}

export default App;
