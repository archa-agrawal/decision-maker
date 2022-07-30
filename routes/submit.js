const express = require('express');
const router  = express.Router();
const {createPoll, getPoll} = require("../db/helper/polls")

module.exports = (db) => {
  router.get("/:id", (req, res) => {    // View poll to vote
    res.send('OK')



    getPoll(db, req.params.id); // logs poll object to console when accessing submit/poll_id
  })



  router.post("/:id", (req, res) => {  // Submit to vote on poll
    res.send('OK')
  })


  return router;
}
