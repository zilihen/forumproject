const express = require("express");
const app = express();
const path = require("path");
const portNumber = 5000;
const bodyParser = require("body-parser");
const cred = require("./routes/loginPage");
const home = require("./routes/home")
const deleteAccount = require("./routes/delete")
const router = express.Router()
require("dotenv").config({
    path: path.resolve(__dirname, ".env"),
});


app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));
app.use(express.static(__dirname+'/public'));

app.use("/loginPage", cred.router)
app.use("/home", home)
app.use("/deleteAccount", deleteAccount)

app.get("/", (request, response) => { 
    if(cred.getLoginStatus() === false) { 
        response.redirect("/loginPage");
    } else { 
        response.redirect("/home");
    }
})



app.listen(portNumber);
console.log(`main URL http://localhost:${portNumber}/`);
