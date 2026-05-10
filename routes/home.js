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


// This "/" is the "/home" so "https://.../home" is the root of this app
router.get("/", (req, res) => {
  if (cred.getLoginStatus() === false) {
    res.redirect("/loginPage"); 
  } else {
    res.render("home", { name: cred.getName() });
  }
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

  res.status(200).json(joke);
})

// TODO: For saving jokes
router.post("/save", async (req, res) => {
  res.sendStatus(200); // placeholder, sent a OK status back
})

router.post("/logout", async (req, res) => {
  try {
    cred.logout();
    res.sendStatus(200); 
    // res.redirect(200, "/loginPage") // does not work when using with fetch, it instead redirect the fetch request itself not the page
  } catch (err) {
    res.sendStatus(404);
  }
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
