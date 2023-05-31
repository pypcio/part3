const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI;
console.log("connectiong to server ");

mongoose
  .connect(url)
  .then((result) => {
    console.log("conneced to MongoDB");
  })
  .catch((error) => {
    console.log("connection error: ", error.message);
  });

//schema -base data cell
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
//added scheme option method // configuration
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model("Person", personSchema);
