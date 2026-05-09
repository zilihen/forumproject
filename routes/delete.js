"use strict";
const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");


// This "/" is the "/deleteAccount" so "https://.../deleteAccount" is the root of this app
router.get("/", (req, res) => {
    let message = "";
    res.render("deleteAccount", { message });
});


const CredModel = require("./loginPage");
const Cred = CredModel.Cred;

async function checkAccount(user, pass) {
    try {
        await mongoose.connect(uri);

        let result = await Cred.deleteOne({ username: user, password: pass });
        return result;
    } catch (err) {
        console.log(err);
    }
}


router.post("/", (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    let result;
    let message;
    (async () => {

        if (username.length === 0 || password.length === 0) {
            console.log("Invalid username or password length.")
            message = "Invalid username or password length.";
        } else {
            result = await checkAccount(username, password);
        }
        if (result) {
            if (result.deletedCount === 0) {
                message = "User does not exist or Wrong Username and/or Password";
            } else if (result.deletedCount === 1) {
                message = "User has been successfully deleted."
            } else {
                message = "Something went wrong and I don't know what."
            }
        }

        res.render("deleteAccount", { message })
    })();
});
module.exports = router;
