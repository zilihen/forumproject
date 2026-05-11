"use strict";
const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const { log } = require("console");
const bcrypt = require("bcrypt");
let name;
let login = false;
let loggedOut = false;


const loginSchema = new mongoose.Schema({
    username: String,
    password: String
});

const Cred = mongoose.model("Cred", loginSchema);

async function checkAccount(user, pass, newAccount) {
    let result = 4;

    let hashedPassword = bcrypt.hashSync(pass, 10);
    let result2 = bcrypt.compareSync(pass, hashedPassword);
    console.log(hashedPassword);
    console.log(result2);


    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);

        const credentials = new Cred({
            username: user,
            password: hashedPassword
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
                if (bcrypt.compare(loginUser.password, pass)) {
                    result = 0;
                }
                else {
                    result = 3;
                }
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

function logout() { 
    loggedOut = true;
    login = false;
}

function getName() { 
    return name;
}


// This "/" is the "/loginPage" so "https://.../loginPage" is the root of this app
router.get("/", (req, res) => {
    let errorMessage = ""; 

    if (loggedOut) { 
        errorMessage = "You have successfully logged out.";
        loggedOut = false;
    }
    
    res.render("login", { errorMessage });
});


router.post("/", (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    let isNewAccount = false;
    let result = 5;
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
            console.log(typeof (result))
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
            console.log("Inalid password")
            errorMessage = "Invalid Password";
        } /*else if (result === 4 || result === 5) {
            console.log("Something went wrong chief. And I don't know what");
            errorMessage = "User does not exist yet. Please create an account.";
        }*/
        if (login) {
            name = username;
            // res.redirect("../") // this redirect backwards so it goes back to normal https://.../
            res.redirect("home");
        } else {
            console.log("Login failed");
            res.render("login", { errorMessage });
        }
    })();
});
module.exports = { router, getLoginStatus, checkAccount, getName, Cred, logout};
