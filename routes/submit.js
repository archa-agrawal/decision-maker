
'use strict'
const express = require('express');
const router  = express.Router();
const {getPoll} = require('../db/helper/polls')


module.exports = (db) => {
  router.get("/:id", (req, res) => {    // View submit page to vote
    const data = getPoll(db, req.params.id) //function is yet to be defined in polls.js
  
    const templateVar = {choices: data.choices}
    res.render('submit', templateVar)
  })

  router.post("/:id", (req, res) => {  // Submit to vote on poll
    res.send('OK')
  })


  return router;
}
