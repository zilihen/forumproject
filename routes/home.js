"use strict";
const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const cred = require("./loginPage");
const { rmSync } = require("fs");
const { name } = require("ejs");

const jokeSchema = new mongoose.Schema({
  username: String,
  setup: String,
  punchline: String,
});

const Joke = mongoose.model("Joke", jokeSchema);

let jokeSetup = "";
let jokePunchline = "";
let user = "";


// This "/" is the "/home" so "https://.../home" is the root of this app
router.get("/", (req, res) => {
  if (cred.getLoginStatus() === false) {
    res.redirect("/loginPage");
  } else {
    user = cred.getName();
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
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    const jokeInfo = new Joke({
      username: user,
      setup: jokeSetup,
      punchline: jokePunchline,
    });
    await jokeInfo.save();
    mongoose.disconnect();
  }
  catch (err) {
    console.error(err);
  }
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
router.post("/delete", async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    await Joke.deleteMany({ username: user });
    mongoose.disconnect();
    res.sendStatus(200);
  }
  catch (err) {
    res.sendStatus(404);
  }
})
router.post("/view", async (req, res) => {

  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    const jokes = await Joke.find({ username: user });
    let html = `<table><tr><th>Number</th><th>Setup</th><th>punchline</th></tr>`
    let num = 1
    jokes.forEach(element => {
      html += `<tr><td>${num}</td><td>${element.setup}</td><td>${element.punchline}</td></tr>`;
      num += 1;
    });
    html += `</table>`;
    const cheatObject = { text: html };
    mongoose.disconnect();
    res.status(200).json(cheatObject);
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
