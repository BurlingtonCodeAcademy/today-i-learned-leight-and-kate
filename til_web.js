/* 
  Today I Learned webapp
*/
const assert = require("assert");
const FactStore = require("./lib/factStore");
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // all POST bodies are expected to be JSON

// Oops, probably shouldn't commit the database password
const dbUrl =
  process.env.MONGODB_URI || "mongodb://til:til123@ds121834.mlab.com:21834/til";
const store = new FactStore(dbUrl);

app.get("/facts", getAll);

async function getAll(_request, response) {
  let cursor = await store.all();
  let output = [];
  cursor.forEach(
    entry => {
      output.push(entry);
    },
    function(err) {
      assert.equal(null, err);
      console.log("Sending " + output.length + " records to client");
      response.type("application/json").send(JSON.stringify(output));
    }
  );
}

app.post("/facts", addFact);

async function addFact(request, response) {
  const { author, title, body } = request.body;
  author.trim();
  title.trim();
  body.trim();
  if (!title) throw "Title cannot be empty";
  let result = await store.addFact(author, title, body);
  let output = {
    status: "ok",
    id: result.id,
    when: result.when
  };
  response.type("application/json").send(JSON.stringify(output));
}

app.delete("/facts", deleteFact);

async function deleteFact(request, response) {
  const id = request.body.id;
  const result = await store.deleteFact(id);
  let output = {
    status: "ok",
    id: result.id
  };
  response.type("application/json").send(JSON.stringify(output));
}

app.post("/facts/:factId", editFact);

async function editFact(request, response) {
  const { author, title, body } = request.body;
  author.trim();
  title.trim();
  body.trim();
  const id = request.params.factId;
  const result = await store.editFact(id, author, title, body);
  await console.log(result.status);
  let output = {
    status: "ok",
    id: result.id
  };
  response.type("application/json").send(JSON.stringify(output));
}

// Serve React Files
if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "til-client/build")));
  // Handle React routing, return all requests to React app
  app.get("*", function(_request, response) {
    response.sendFile(path.join(__dirname, "til-client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`TIL web app listening on port ${port}!`));
