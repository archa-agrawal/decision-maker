const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  router.get("/:id", (req, res) => {    // View poll to vote
    res.send('OK')
  })



  router.post("/:id", (req, res) => {  // Submit to vote on poll
    res.send('OK')
  })


  return router;
}
