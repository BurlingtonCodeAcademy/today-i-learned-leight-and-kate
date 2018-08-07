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
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'til';

start();

function start() {
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
    saveEntry(entry);
  }
  else if (command === 'list') {
    printEntries();
  }
  else {
    help();
  }
}

// display help and exit
function help() {
  console.log(`Today I Learned
  
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
function printEntries() {
  connectAnd((db, collection, finishUp) => {
    let cursor = collection.find({}).sort([['when', 1]]);
    let currentDay;
    cursor.forEach((entry) => {
      currentDay = printEntry(entry, currentDay);
    }, function (err) {
      assert.equal(null, err);
      finishUp();
    });
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

function saveEntry(entry) {
  connectAnd((db, collection, finishUp) => {
    collection.insertOne(entry, (err, r) => {
      assert.equal(null, err);
      assert.equal(1, r.insertedCount);
      finishUp();
    });
  });
}

// do something with the database
// the caller must pass a callback, which we will call with the db and collection;
// then the caller must call *another* callback to close the database connection
function connectAnd(callback) {
  MongoClient.connect(url, { useNewUrlParser: true }, 
    function (err, client) {
    
      assert.equal(null, err);
      // console.log("Connected successfully to database");

      const db = client.db(dbName);
      const collection = db.collection('entries');

      callback(db, collection, () => {
        client.close();
      });
  });
}
