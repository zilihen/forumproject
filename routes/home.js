"use strict";
const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const dns = require("dns");
dns.setServers(["1.1.1.1", "1.0.0.1"]);
const mongoose = require("mongoose");
const uri =
  "mongodb+srv://adminUser617:wGgaJxnp2OpQy2Lj@cluster0.wuckxtp.mongodb.net/CMSC335DB?retryWrites=true&w=majority&appName=Cluster0";
const dummy = require("./loginPage");

const jokeSchema = new mongoose.Schema({
  username: String,
  setup: String,
  punchline: String,
});

const Joke = mongoose.model("Joke", jokeSchema);

let jokeSetup = "";
let jokePunchline = "";

generateJoke();

router.get("/", (req, res) => {
  res.render("home");
});

async function generateJoke() {
  console.log("pressing the button did something?");
  const response = await fetch(
    "https://official-joke-api.appspot.com/jokes/random",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = await response.json();
  jokeSetup = data.setup;
  jokePunchline = data.punchline;
  text = `${setup}\n${punchline}`;
  document.querySelector("#textZone").value = text;
}

async function saveJoke() {
  try {
    await mongoose.connect(uri);
    const jokeInfo = new Joke({
      username: user,
      setup: jokeSetup,
      punchline: jokePunchline,
    });
    await jokeInfo.save();
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

function logout() {
  dummy.logout();
}

module.exports = router;
