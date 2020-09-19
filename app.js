/*
 * Name: Kelly Chhor
 * Date: November 13, 2019
 * Section: CSE 154 AL
 *
 * This is the app.js for the To-Do List API. This helps the API function with two GET
 * requests for information in the API and one POST request to handle the form in index.html
 */

"use strict";

const express = require("express");
const fs = require("fs").promises;
const app = express();
const multer = require('multer');
const upload = multer();

/**
 * Gets available to-do list names from filesnames.txt and returns a json object with
 * the ist of names in a array
 */
app.get("/lists", async (req, res) => {
  try {
    let lists = await fs.readFile("resources/filenames.txt", "utf8");
    lists = lists.split(/\n/);
    let listJson = {filename: []};
    for (let i = 0; i < lists.length; i++) {
      listJson.filename[i] = lists[i];
    }
    res.json(listJson);
  } catch (err) {
    handleError(res, "Error with request!");
  }
});

/**
 * Gets name and items from specified to-do list from JSON file and returns the result
 * to the user.
 */
app.get("/lists/:name", async (req, res) => {
  let name = req.params["name"];
  let lists;
  try {
    let result;
    lists = await fs.readFile("resources/lists.json", "utf8");
    lists = JSON.parse(lists).lists;
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].name === name) {
        result = lists[i];
      }
    }
    res.json(result);
  } catch (err) {
    handleError(res, "Files do not exist");
  }
});

/**
 * Gets information from user created list fields and creates a list based on that
 * information. It stores the name of the list in filenames.txt and the name and
 * items information in lists.json. This incorporates the multer package and code
 * was inspired by the documentation page here: https://github.com/expressjs/multer
 */
app.post("/submit", upload.none(), async (req, res) => {
  res.type("text");
  let itemContainer = [];
  for (let i = 1; i <= req.body.itemnum; i++) {
    itemContainer[i - 1] = req.body["listitem" + i];
  }
  let jsonObject = {"name": req.body.name, "items": itemContainer};
  try {
    await fs.appendFile("resources/filenames.txt", "\n" + req.body.name);
    let originalFile = await fs.readFile("resources/lists.json", "utf8");
    originalFile = JSON.parse(originalFile);
    originalFile.lists.push(jsonObject);
    await fs.writeFile("resources/lists.json", JSON.stringify(originalFile));
    res.send("Success");
  } catch (err) {
    handleError(res, "Something went wrong with adding files");
  }
});

/**
 * Sends an error message to the user through the API
 * @param {object} res - Response object that is sent for messages to user
 * @param {String} text - Error message
 */
function handleError(res, text) {
  res.type("text");
  res.status(400).send(text);
}

app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT);
