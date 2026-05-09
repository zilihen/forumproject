"use strict";
const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const cred = require("./loginPage");
const { rmSync } = require("fs");

const jokeSchema = new mongoose.Schema({
  username: String,
  setup: String,
  punchline: String,
});

const Joke = mongoose.model("Joke", jokeSchema);

let jokeSetup = "";
let jokePunchline = "";


router.get("/", (req, res) => {
  res.render("home", { name: cred.getName() });
});


// async function generateJoke() {
//   console.log("pressing the button did something?");
//   const response = await fetch(
//     "https://official-joke-api.appspot.com/jokes/random",
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     },
//   );
//   const data = await response.json();
//   jokeSetup = data.setup;
//   jokePunchline = data.punchline;
//   text = `${setup}\n${punchline}`;
//   document.querySelector("#textZone").value = text;
// }

// this will send a json response back to the function that made the fetch request to https://.../home/generate
router.post("/generate", async (req, res) => { 
  let response = await fetch("https://official-joke-api.appspot.com/jokes/random"); 
  const data = await response.json(); 
  jokeSetup = data.setup
  jokePunchline = data.punchline; 

  const joke = { 
    setup: data.setup, 
    punchline: data.punchline
  }

  res.json(joke);
})


router.post("/save", async (req, res) => { 

  res.sendStatus(200); // placeholder, sent a OK status back
})
// async function saveJoke() {
//   try {
//     await mongoose.connect(uri);
//     const jokeInfo = new Joke({
//       username: user,
//       setup: jokeSetup,
//       punchline: jokePunchline,
//     });
//     await jokeInfo.save();
//     mongoose.disconnect();
//   } catch (err) {
//     console.error(err);
//   }
// }


module.exports = router;
