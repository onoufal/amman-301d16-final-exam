"use strict";
// Application Dependencies
const express = require("express");
const pg = require("pg");
const methodOverride = require("method-override");
const superagent = require("superagent");
const cors = require("cors");

// Environment variables
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

// Application Setup
const app = express();

// Express middleware

app.use(methodOverride("_method"));

// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));

// Specify a directory for static resources
app.use(express.static("./public"));

// // define our method-override reference
// const methodOverride = me;

// Set the view engine for server-side templating
app.set("view engine", "ejs");

// Use app cors
app.cors = cors();

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --

//get 10 quotes
app.get("/", (req, res) => {
  const num = 10;
  const url = `https://thesimpsonsquoteapi.glitch.me/quotes?count=${num}`;
  superagent
    .get(url)
    .set("User-Agent", "1.0")
    .then((results) => {
      const quotes = results.body.map((obj) => new Qoute(obj));
      // res.send(results.body);
      // console.log(quotes);
      res.render("./pages/index", { quotes: quotes });
    });
});

//save qoutes
app.post("/saved", (req, res) => {
  let { quote, character, image, characterDirection } = req.body;
  const sql = `INSERT INTO qoutes(quote, character, image, characterDirection) VALUES($1, $2, $3, $4);`;
  const values = [quote, character, image, characterDirection];
  client.query(sql, values).then(() => {
    res.redirect("/saved");
  });
});

//render to save
app.get("/saved", (req, res) => {
  const sql = `SELECT * FROM qoutes;`;
  const values = [];
  client.query(sql, values).then((results) => {
    res.render("./pages/saved", { results: results.rows });
  });
});

// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --

// helper functions

function Qoute(data) {
  this.quote = data.quote;
  this.character = data.character;
  this.image = data.image;
  this.characterDirection = data.characterDirection;
}

// app start point
client
  .connect()
  .then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
  );
