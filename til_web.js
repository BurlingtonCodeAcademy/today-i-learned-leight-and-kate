/* 
  Today I Learned webapp
*/
const assert = require("assert");
const FactStore = require("./lib/factStore");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.static("public")); // static file server
app.use(express.json()); // all POST bodies are expected to be JSON

const dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017";
const store = new FactStore(dbUrl);

app.get("/facts", getAll);

async function getAll(request, response) {
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
  console.log(request.body);
  console.log("author: " + author);
  let result = await store.addFact(author.trim(), title.trim(), body.trim());
  let output = {
    status: "ok",
    id: result.id
  };
  response.type("application/json").send(JSON.stringify(output));
}

app.listen(port, () => console.log(`TIL web app listening on port ${port}!`));
