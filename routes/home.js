"use strict";
const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config({
    path: path.resolve(__dirname, ".env"),
});

app.set("views", path.resolve(__dirname, "templates"));


router.get("/", (req, res) => {
    res.render("home");
});

module.exports = router;
