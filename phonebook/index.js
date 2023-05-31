const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
// const mongoose = require("mongoose");
const Person = require("./models/person");
const app = express();
morgan.token("data", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);
// sync database

// const generateId = () => {
//   const newID = Math.random().toString(36).substring(2, 9);
//   return newID;
// };

//do wywalenia strona
app.get("/", (req, res) => {
  res.send("<h3>Hello</h3>");
});
//GET all data from MongoDB
app.get("/api/persons", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});
//GET 1 person from MongoDB
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((findPerson) => {
      if (findPerson) {
        response.json(findPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});
//GET info about api

app.get("/api/info", (req, res) => {
  const time = new Date();
  Person.find({}).then((people) => {
    res.send(
      `<p>Phonebook has info for ${people.length} people</p> <br/> <p>${time}</p>`
    );
  });
});

//create person, send to mongoDB and back to front using response.json()
app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log("body", body);
  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: "content is missing" });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});
//delete
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});
//update
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});
//out of route
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);
//error handler
const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};
app.use(errorHandler);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
