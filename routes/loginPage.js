"use strict";
const express = require("express");
const alert = require("alert");
const app = express();
const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, "credentialsDontPost/.env"),
});
const router = express.Router();
const dns = require("dns")
dns.setServers(["1.1.1.1", "1.0.0.1"]);
const mongoose = require("mongoose");
let login = false;
const uri = "mongodb+srv://adminUser617:wGgaJxnp2OpQy2Lj@cluster0.wuckxtp.mongodb.net/CMSC335DB?retryWrites=true&w=majority&appName=Cluster0";


async function checkAccount(user, pass, newAccount) {
    let result = 3;

    try {
        await mongoose.connect(uri);
        const loginSchema = new mongoose.Schema({
            username: String,
            password: String
        });

        const Cred = mongoose.model("Cred", loginSchema);

        const credentials = new Cred({
            username: user,
            password: pass
        });

        const loginUser = await Cred.findOne({ username: user });


        if (newAccount) {
            if (loginUser === null) {
                await credentials.save()
                result = 0;
            }
            else {
                result = 1;
            }
        }
        else {
            if (loginUser === null) {
                result = 2;
            }
            else {
                result = 0;
            }
        }

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
    console.log(result)
    return result;
}

function getLoginStatus() {
    return login;
}

// This "/" is the "/loginPage" so "https://.../loginPage" is the root of this app
router.get("/", (req, res) => {
    let errorMessage = "";
    res.render("login", { errorMessage });
});


router.post("/", (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    let isNewAccount = false;
    let result = 4;
    let errorMessage = "";
    (async () => {
        console.log(req.body.newAccount);
        if (req.body.newAccount) {
            isNewAccount = true;
        }

        if (username.length === 0 || password.length === 0) {
            console.log("Invalid username or password length.")
            errorMessage = "Invalid username or password length.";
        } else {
            result = await checkAccount(username, password, isNewAccount);
            console.log(typeof(result))
        }
        if (result === 0) {
            login = true;
        } else if (result === 1) {
            console.log("User already exists. Please use a different username.");
            errorMessage = "User already exists. Please use a different username.";
        } else if (result === 2) {
            console.log("User does not exist yet. Please create an account.");
            errorMessage = "User does not exist yet. Please create an account.";
        } else if (result === 3) {
            console.log("Something went wrong chief. And I don't know what");
            errorMessage = "User does not exist yet. Please create an account.";
        }
        if (login) {
            res.redirect("home");
        } else {
            console.log("Login failed");
            res.render("login", { errorMessage });
        }
    })();
});
module.exports = { router, getLoginStatus, checkAccount };
