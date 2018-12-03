"use strict";

/*
NodeJS Mongo Driver docs and tutorial:
  https://mongodb.github.io/node-mongodb-native/
  http://mongodb.github.io/node-mongodb-native/3.1/tutorials/crud/
*/
const mongodb = require("mongodb");
const assert = require("assert");
const moment = require("moment");
const MongoClient = mongodb.MongoClient;

class FactStore {
  constructor(dbUrl) {
    this.dbUrl = dbUrl;
    this.dbClient = null;
    this.dbName = "til";
  }

  // Open (or reuse) a connection to the database and
  // return the MongoDB Client.
  async client() {
    if (this.dbClient && this.dbClient.isConnected()) {
      return this.dbClient;
    } else {
      // http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html
      console.log(`Connecting to ${this.dbUrl}...`);
      this.dbClient = await MongoClient.connect(
        this.dbUrl,
        { useNewUrlParser: true }
      );
      console.log("Connected to database.");
      return this.dbClient;
    }
  }

  // Get the MongoDB Collection for this record type (facts).
  // Must be asynchronous because the database connection
  // might not currently be open.
  async collection() {
    const client = await this.client();
    const db = client.db(this.dbName);
    const collection = db.collection("facts");
    return collection;
  }

  // Get a sorted cursor for all facts.
  async all() {
    let collection = await this.collection();
    return collection.find({}).sort([["when", -1]]);
  }

  // Print all entries, in chronological order,
  // with a headline for each distinct date.
  async printAll() {
    let cursor = await this.all();

    let currentDay;
    await cursor.forEach(fact => {
      let when = moment(fact.when);
      let startOfDay = when.format("YYYYMMDD");
      if (!currentDay || currentDay != startOfDay) {
        console.log(when.format("MMMM Do, YYYY"));
        currentDay = startOfDay;
      }
      let output = when.format("  hh:mm a - ") + fact.text;
      console.log(output);
      return currentDay;
    });
  }

  // Create an entry with the given text
  async addFact(author, title, body) {
    let entry = {
      when: new Date(),
      body,
      author,
      title
    };

    let collection = await this.collection();
    let result = await collection.insertOne(entry);
    assert.equal(1, result.insertedCount); // sanity check
    console.log(`Inserted fact with id: ${result.insertedId}`);

    return { id: result.insertedId, when: entry.when };
  }
  async deleteFact(id) {
    const collection = await this.collection();
    const result = await collection.deleteOne({
      _id: new mongodb.ObjectID(id)
    });
    assert.equal(1, result.deletedCount);
    console.log(`Deleted fact ${id}`);
    return { id };
  }

  async editFact(id, author, title, body) {
    const collection = await this.collection();
    const result = await collection.update(
      {
        _id: new mongodb.ObjectID(id)
      },
      { $set: { author, title, body } }
    );
    result.result.nModified === 1
      ? console.log(`Edited fact ${id}`)
      : console.log(`fact ${id} not modified`);
    return { id };
  }
}
module.exports = FactStore;
