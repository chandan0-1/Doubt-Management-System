const mongoose = require("mongoose");


mongoose.connect("mongodb://localhost/doubt_mgmt");

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error in connecting database"));

db.once("open",function(){
  console.log("connected to the database successsfully");
});

module.exports = db;
