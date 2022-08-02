
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


  let userInput = formatResults(req.body, req.params.id);  // formats user input to be saved in the database
  console.log('userinput :', userInput);

  nameRequiredCheck(db, req.params.id) // checks if name is required for the poll
  .then((data) => {
      if (data) {
        if (!userInput.name) {
          res.send("Please enter your name"); // if name is required and user doesn't enter name, send error
          return;
        }
      }
      saveSubmission(db, userInput) // if name is not required, save the submission
      .then((data) => {
      res.redirect("/results/i/" + data); // redirect to results page
      return;
      });

    });
  })

  return router;
}
