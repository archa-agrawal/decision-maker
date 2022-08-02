const express = require('express');
const router  = express.Router();
const {createPoll, getPoll} = require("../db/helper/polls")

module.exports = (db) => {
  router.get("/", (req, res) => {  // View page to create a new poll
    res.render('create');
  });

  router.post("/", (req, res) => { // Submit to create new poll
    const poll = req.body;
    createPoll(db, poll)
    .then((id) => {
      res.redirect(`/submit/${id}`)
    })
  });


  return router;
}
