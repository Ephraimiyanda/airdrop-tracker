const uri = process.env.MONGODB_URI;
const mongoose = require("mongoose");
const Db = () => {
  mongoose
    .connect(uri)
    .then(() => {
      console.log("mongodb connected");
    })
    .catch((err: any) => {
      console.log("an error occurred", err);
    });
};

module.exports = Db;
