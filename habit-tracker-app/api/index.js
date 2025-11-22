const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://rohanrawat7508:Rohan7508@cluster0.ilfiiql.mongodb.net/").then(()=>{
  console.log("Mongo db connected to project")
}).catch((err)=>
console.log("Error white connecting to mongoDb - ", err));

app.listen(port, ()=>{
  console.log("Server running on port - ", port)
})