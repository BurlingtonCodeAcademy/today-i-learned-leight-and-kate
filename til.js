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

let db, mongoClient;

MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
  assert.equal(null, err);
  // console.log("Connected successfully to database");
  mongoClient = client;
  db = client.db(dbName);
  start();
});

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
    saveEntryAndQuit(entry);
  }
  else if (command === 'list') {
    printEntriesAndQuit();
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
function printEntriesAndQuit() {
    let cursor = db.collection('entries').find({}).sort([['when', 1]]);
    let currentDay;
    cursor.forEach((entry) => {
      currentDay = printEntry(entry, currentDay);
    }, (err) => {
      assert.equal(null, err);
      mongoClient.close()
      process.exit();
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

function saveEntryAndQuit(entry) {
  db.collection('entries').insertOne(entry, (err, r) => {
    assert.equal(null, err);
    assert.equal(1, r.insertedCount);
    mongoClient.close();
    process.exit();
  });
}
