
'use strict'
const express = require('express');
const router  = express.Router();
const {getPoll, formatResults, nameRequiredCheck, saveSubmission} = require('../db/helper/polls')


module.exports = (db) => {

  router.get("/:id", (req, res) => {    // View submit page to vote
    getPoll(db, req.params.id)
    .then((data) => {
      const templateVar = {poll: data}
      res.render('submit', templateVar)
    });
  })

  router.post("/:id", (req, res) => {  // Submit to vote on poll


  let userInput = formatResults(req.body, req.params.id);
  console.log(userInput);

  nameRequiredCheck(db, req.params.id)
  .then((data) => {
      if (data) {
        if (!userInput.name) {
          res.send("Please enter your name");
          return;
        }
        saveSubmission(db, userInput);
        res.send("Thanks for voting!");
        return;
      }
      saveSubmission(db, userInput);
      res.send("Thanks for voting!");
      return;

    });
  })





  return router;
}
