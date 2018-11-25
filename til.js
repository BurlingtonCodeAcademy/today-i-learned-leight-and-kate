#!/usr/bin/env node
'use strict';

/*
NodeJS Mongo Driver docs and tutorial:
  https://mongodb.github.io/node-mongodb-native/
  http://mongodb.github.io/node-mongodb-native/3.1/tutorials/crud/
*/

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const moment = require('moment');

// Connection URL format:
// const url = 'mongodb://$[username]:$[password]@$[hostlist]/$[database]?authSource=$[authSource]';

// see https://devcenter.heroku.com/articles/mongolab
const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'til';

start();

async function start() {
  // the first two args are full paths to the executable files,
  // so ignore them
  let params = process.argv.slice(2);

  // the first real arg is the command
  let command = params.shift();

  if (command === 'help' || !command) {
    help();
  }
  else if (command === 'add') {
    let text = params.join(' ').trim();
    let entry = createEntry(text);
    await saveEntry(entry);
  }
  else if (command === 'list') {
    await printEntries();
  }
  else {
    help();
  }
}

// display help and exit
function help() {
  console.log(`Today I Learned
  
  Run locally with:
  
    node ./til.js

  Usage: 
  
  til add "something cool i learned today"
    adds an entry to your TIL DB
  til list
    shows all entries, day by day
  til help
    shows this message
  `)
  process.exit(0);
}

// create an entry with the given text
function createEntry(text) {
  let entry = {
    when: new Date(),
    text: text
  };
  return entry;
}


// print all entries, in chronological order
async function printEntries() {
  storedEntries()
    .then((collection) => {

      console.log("Finding all entries")
      let cursor = collection.find({}).sort([['when', 1]]);
      let currentDay;
      cursor.forEach((entry) => {
        currentDay = printEntry(entry, currentDay);
      })
    });
}

/*
  For each entry...
  1. if the current day has changed, prints the day 
  2. prints the entry time+text
  3. returns the current day

  The result looks like this:

  July 28th, 2018
    08:45 pm - dogs like to bark
    09:17 pm - neighbors don't like barking dogs
  July 29th, 2018
    03:23 pm - chickens like corn
*/
function printEntry(entry, currentDay) {
  let when = moment(entry.when);
  let startOfDay = when.format('YYYYMMDD');
  if (!currentDay || currentDay != startOfDay) {
    console.log(when.format('MMMM Do, YYYY'));
    currentDay = startOfDay;
  }
  let output = when.format('  hh:mm a - ') + entry.text;
  console.log(output);
  return currentDay;
}

async function saveEntry(entry) {
  storedEntries().then((collection) => {
    collection.insertOne(entry)
      .then((result) => {
        assert.equal(1, result.insertedCount); // sanity check
        console.log('Inserted fact as id ' + result.insertedId)
      })
  });
}

// fact collection

function storedEntries() {
  const promise = new Promise((resolve, reject) => {
    console.log("Connecting to database...");
    const connected = MongoClient.connect(dbUrl, { useNewUrlParser: true })
    connected.then((client) => {

      console.log("Connected to database.");
      const db = client.db(dbName);
      const collection = db.collection('entries');

      // pass the collection in to the caller's `then` block
      resolve(collection);

      // tacking a `then` on to this promise after resolving it
      // adds it to the end of the microtask queue, so it will
      // execute after all the other `then`s added by the caller...
      // hopefully :-)
      // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#Timing
      //
      // Unfortunately, this seems to break code like this:
      //    let collection = await storedEntries()
      //    let cursor = await collection.find({})
      // 
      promise.then(() => {
        console.log("Closing connection to database...");
        client.close();
        console.log("Closed connection to database");
      });

      return promise;
    });
  })

  return promise;
}

// OLD CODE:
// the caller must pass a callback, which we will call with the db and collection;
// then the caller must call *another* callback to close the database connection.
function connectAnd(callback) {
  MongoClient.connect(dbUrl, { useNewUrlParser: true },
    function (err, client) {
      assert.equal(null, err);
      const db = client.db(dbName);
      const collection = db.collection('entries');

      callback(db, collection, () => {
        client.close();
      });
    });
}
