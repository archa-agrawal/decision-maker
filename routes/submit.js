
'use strict'
const express = require('express');
const router  = express.Router();
const {getPoll, formatResults, nameRequiredCheck, saveSubmission, getDataFromPollId} = require('../db/helper/polls')


module.exports = (db, client) => {

  router.get("/:id", (req, res) => {    // View submit page to vote
    getPoll(db, req.params.id)
    .then((data) => {
      const templateVar = {poll: data}
      res.render('submit', templateVar)
    });
  })

  router.post("/:id", (req, res) => {  // Submit to vote on poll

    let id;
    const pollid = req.params.id

    let userInput = formatResults(req.body, pollid);  // formats user input to be saved in the database
    //console.log('userinput :', userInput);

    nameRequiredCheck(db, pollid) // checks if name is required for the poll
    .then((data) => {
      if (data) {
        if (!userInput.name) {
          res.send("Please enter your name"); // if name is required and user doesn't enter name, send error
          return;
        }
      }
      saveSubmission(db, userInput) // save the submission
      .then((data) => {
        id = data;

        getDataFromPollId(db, pollid)
        .then((data) => {
          const poll = data.rows[0]
          console.log(poll)
          const messageData = {
            from: 'Decision Maker<admin@decision-maker.com>',
            to: poll.creatoremail,
            subject: 'New submission: Notification',
            text: `
            Thank you ${poll.creatorname} for using Decision Maker.

            Your poll titled: "${poll.title}" just received a response${userInput.name ? ` from ${userInput.name}` : ''}. Click this link: http://localhost:8080/results/i/${id} to see the response.

            Please use this link: http://localhost:8080/results/${pollid} to access the current poll result of "${poll.title}"`
          };
          client.messages.create(process.env.DOMAIN, messageData)
        })
        .then(() => {
          res.redirect("/results/i/" + id); // redirect to results page
          return;
        })
        .catch((err) => {
          console.error(err);
        });

      });

    });
  })

  return router;
}
