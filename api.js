require("dotenv").config()
const express = require("express")
const app = express()

const port = process.env.PORT || 4000
const HTTPError = require("node-http-error")
const bodyParser = require("body-parser")
const { addPainting, getPainting, updPainting, delPainting } = require("./dal")
const { prop, pluck, isEmpty } = require("ramda")
const reqFieldChecker = require("./lib/check-req-fields")

///////////////////////////////////////////////////////////////////////////////
//  Ensure request body contains JSON object                                 //
///////////////////////////////////////////////////////////////////////////////
app.use(bodyParser.json())

///////////////////////////////////////////////////////////////////////////////
//  Respond to empty request on localhost:4000                               //
///////////////////////////////////////////////////////////////////////////////
app.get("/", function(req, res, next) {
  res.send("Welcome to the Art API. Manage all the paintings for much win.")
})

///////////////////////////////////////////////////////////////////////////////
//  CREATE: use POST to add a single painting                                //
///////////////////////////////////////////////////////////////////////////////
app.post("/paintings", (req, res, next) => {
  addPainting(prop("body", req))
    .then(addedPaintingResult => res.status(201).send(addedPaintingResult))
    .catch(err => next(new HTTPError(err.status, err.message, err)))
})

///////////////////////////////////////////////////////////////////////////////
//  RETRIEVE: use GET to retrieve a single painting by its id                //
///////////////////////////////////////////////////////////////////////////////
app.get("/paintings/:id", (req, res, next) =>
  getPainting(req.params.id)
    .then(painting => res.send(painting))
    .catch(err => next(new HTTPError(err.status, err.message, err)))
)

///////////////////////////////////////////////////////////////////////////////
//  UPDATE a Painting:                                                       //
// The request body must contain a JSON object that represents the painting  //
// being updated. The request body must include the _id, _rev, name,         //
// movement, artist, yearCreated, museum, and type fields. Not providing the //
// most recent _rev value will cause an 409 - conflict error to occur.       //
///////////////////////////////////////////////////////////////////////////////
const paintingFieldChecker = reqFieldChecker([
  "_id",
  "_rev",
  "name",
  "movement",
  "artist",
  "yearCreated",
  "museum",
  "type"
])

app.put("/paintings/:id", (req, res, next) => {
  const fieldsMissing = paintingFieldChecker(req.body)
  if (isEmpty(fieldsMissing)) {
    updPainting(req.body)
      .then(painting => res.send(painting))
      .catch(err => next(new HTTPError(err.status, err.message, err)))
  } else {
    next(
      new HTTPError(
        400,
        "Bad Request: Missing field in painting's JSON object."
      )
    )
  }
})

///////////////////////////////////////////////////////////////////////////////
//  DELETE a single painting by its id                                       //
///////////////////////////////////////////////////////////////////////////////
app.delete("/paintings/:id", (req, res, next) =>
  delPainting(req.params.id)
    .then(painting => res.send(painting))
    .catch(err => next(new HTTPError(err.status, err.message, err)))
)
///////////////////////////////////////////////////////////////////////////////
//   Error handler                                                           //
///////////////////////////////////////////////////////////////////////////////
app.use((err, req, res, next) => {
  console.log("api.js Error: ", err)
  res.status(err.status || 500).send(err.message)
})

///////////////////////////////////////////////////////////////////////////////
//   Listen to port (use 4000 by default)                                    //
///////////////////////////////////////////////////////////////////////////////
app.listen(port || 4000, () =>
  console.log("ART API is listening on port: ", port || 4000)
)
