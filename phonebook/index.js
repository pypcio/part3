const express = require("express");
const app = express();
app.use(express.json());
let persons = [
  {
    id: "36qsbcf",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "bm22pvw",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "mfby0jp",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "r8s3uev",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

const generateId = () => {
  const newID = Math.random().toString(36).substring(2, 9);
  return newID;
};
app.post("/api/persons", (request, response) => {
  const body = request.body;
  // const checkName = persons.find((p) => p.name === body.name);
  // console.log("checked", checkName);
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  } else if (persons.find((p) => p.name === body.name) !== undefined) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId(),
  };
  // console.log("new person:", person);
  persons = persons.concat(person);
  response.json(person);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});
app.get("/api/info", (req, res) => {
  // console.log();
  const time = new Date();
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p> <br/> <p>${time}</p>`
  );
});
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
