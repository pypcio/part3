const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("password is missing");
  process.exit(1);
}
const dataName = "people";
const password = process.argv[2];
const namePerson = process?.argv[3];
const numberPerson = process?.argv[4];

const url = `mongodb+srv://pypcior:${password}@cluster0.xoovpme.mongodb.net/${dataName}?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const peopleSchema = new mongoose.Schema({
  name: String,
  number: String,
});
peopleSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
// console.log("peopleSchema: ", peopleSchema);
const Person = mongoose.model("Person", peopleSchema);

const person = new Person({
  name: namePerson,
  number: numberPerson,
});
//saving object in database
// console.log("person", person?.name);
if (person.name && person.number) {
  person.save().then((result) => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
// fetching data
