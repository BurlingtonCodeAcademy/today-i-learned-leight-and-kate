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
        assistant.finishResponse('text/json', { status: 'ok' });
      });
    } else {
      assistant.sendError(405, "Method '" + request.method + "' Not Allowed");
    }
  }


  function isTilAction(pathParams) {
    return (pathParams.action === 'til');
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
        console.log("Sending " + output.length + " records to client");
        assistant.finishResponse(contentType, JSON.stringify(output));
      });
    });
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


// do something with the database
// the caller must pass a callback, which we will call with the db and collection;
// then the caller must call *another* callback to close the database connection
function connectAnd(callback) {
  MongoClient.connect(dbUrl, { useNewUrlParser: true }, function (err, client) {
    assert.equal(null, err);

    const db = client.db(dbName);
    const collection = db.collection('entries');

    callback(db, collection, () => {
      client.close();
    });
  });
}

