/* 
Today I Learned webapp

TODO:
- rename Entries to Facts
- extract Fact class
*/

const http = require('http');
const Assistant = require('./lib/assistant');

const port = process.env.PORT || 5000;

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const moment = require('moment');
const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'til';

http.createServer(handleRequest).listen(port);
console.log("Listening on port " + port);

function handleRequest(request, response) {
  let url = require('url').parse(request.url);
  let path = url.pathname;

  console.log('Finding ' + path);
  let assistant = new Assistant(request, response);

  // "routing" happens here (not very complicated)
  let pathParams = assistant.parsePathParams(path);
  if (isTilAction(pathParams)) {
    handleTilAction(request, assistant);
  } 
  else if (assistant.isRootPathRequested()) {
    assistant.sendFile('./public/index.html');
  }
  else {
    assistant.handleFileRequest();
  }

  function handleTilAction(request) {
    if (request.method === 'GET') {
      sendTilEntries();
    } else if (request.method === 'POST') {
      assistant.parsePostParams((params) => {
        createEntry(params.text);
        assistant.finishResponse('text/json', {status: 'ok'});
      });
    } else {
      assistant.sendError(405, "Method '" + request.method + "' Not Allowed");
    }
  }

  function sendTilEntries() {
    connectAnd((db, collection, finishUp) => {
      let cursor = collection.find({}).sort([['when', 1]]);
      let output = [];
      cursor.forEach((entry) => {
        output.push(entry);
      }, function (err) {
        assert.equal(null, err);
        finishUp();
        let contentType = 'text/json';
        console.log(output);
        assistant.finishResponse(contentType, JSON.stringify(output));    
      });
    });
  
  }

  function isTilAction(pathParams) {
    return (pathParams.action === 'til');
  }
    
}


///// Mongo/TIL Entry here

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

// do something with the database
// the caller must pass a callback, which we will call with the db and collection;
// then the caller must call *another* callback to close the database connection
function connectAnd(callback) {
  MongoClient.connect(dbUrl, { useNewUrlParser: true }, function (err, client) {
    assert.equal(null, err);
    // console.log("Connected successfully to database");

    const db = client.db(dbName);
    const collection = db.collection('entries');

    callback(db, collection, () => {
      client.close();
    });
  });
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
