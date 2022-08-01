
'use strict'
const express = require('express');
const router  = express.Router();
const {getPoll} = require('../db/helper/polls')
const {nameRequiredCheck} = require('../db/helper/submit-helpers')


module.exports = (db) => {

  router.get("/:id", (req, res) => {    // View submit page to vote
    getPoll(db, req.params.id)
    .then((data) => {
      const templateVar = {poll: data}
      res.render('submit', templateVar)
    });
  })

  router.post("/:id", (req, res) => {  // Submit to vote on poll
    res.send('OK')
  })





  return router;
}
