const express = require("express");
const app = express();
const path = require("path");
const portNumber = 5000;
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));

const databaseName = "CMSC335DB";
const collectionName = "userCredentials";
const uri = process.env.MONGO_CONNECTION_STRING;
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

app.listen(portNumber);
console.log(`main URL http://localhost:${portNumber}/`);
